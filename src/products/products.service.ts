import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { FilterProductDto } from './dto/filter-product.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const { categoryId } = createProductDto;

      // ✅ Validación de lógica de negocio
      const categoryExists = await this.prisma.category.findUnique({
        where: { id: categoryId },
      });

      if (!categoryExists) {
        throw new BadRequestException('La categoría proporcionada no existe');
      }

      // 🧠 Aquí podrías agregar otras validaciones si las necesitás (por ejemplo: stock, códigos internos, reglas empresariales, etc.)

      // ✅ Crear el producto
      const product = await this.prisma.product.create({
        data: createProductDto,
      });

      return {
        message: 'Producto creado correctamente',
        data: product,
      };
    } catch (error) {
      this.logger.error('Error en la creación de producto', error);

      // ✨ Si el error es de Prisma, el filtro global lo atrapará
      // Aquí podrías filtrar si querés hacer algo especial para errores de lógica
      throw error;
    }
  }

  async findAll(filterDto: FilterProductDto) {
    try {
      const { page = 1, limit = 10, categoryId, status } = filterDto;

      const skip = (page - 1) * limit;

      const filters: Prisma.ProductWhereInput = {
        deletedAt: null,
        ...(categoryId ? { categoryId } : {}),
        ...(status ? { status } : {}),
      };

      const [totalRecords, products] = await Promise.all([
        this.prisma.product.count({ where: filters }),
        this.prisma.product.findMany({
          where: filters,
          skip,
          take: limit,
          orderBy: { name: 'asc' },
        }),
      ]);

      return {
        products,
        meta: {
          total: totalRecords,
          page,
          lastPage: Math.ceil(totalRecords / limit),
        },
      };
    } catch (error) {
      this.logger.error('Error al listar productos', error);
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id },
      });

      if (!product) {
        throw new NotFoundException(`Producto #${id} no encontrado`);
      }

      return product;
    } catch (error) {
      this.logger.error(`Error al buscar el producto ${id}`, error);
      throw error;
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    await this.findOne(id);

    try {
      if (updateProductDto.categoryId) {
        const categoryExists = await this.prisma.category.findUnique({
          where: { id: updateProductDto.categoryId },
        });
        if (!categoryExists) {
          throw new BadRequestException('La categoría proporcionada no existe');
        }
      }

      const product = await this.prisma.product.update({
        where: {
          id,
        },
        data: updateProductDto,
      });

      return {
        message: 'Producto actualizado correctamente',
        data: product,
      };
    } catch (error) {
      this.logger.error(`Error al actualizar el producto ${id}`, error);
      throw error;
    }
  }

  async remove(id: string) {
    try {
      await this.findOne(id);
      const product = await this.prisma.product.update({
        where: { id },
        data: {
          deletedAt: new Date(),
        },
      });
      return {
        message: `Producto ${id} eliminado satisfactoriamente`,
        data: product,
      };
    } catch (error) {
      this.logger.error(`Error al eliminar el producto ${id}`, error);
      throw error;
    }
  }

  async toggleStatus(id: string) {
    try {
      const product = await this.findOne(id); // ya valida existencia

      const newStatus = product.status === 'activo' ? 'inactivo' : 'activo';

      const updated = await this.prisma.product.update({
        where: { id },
        data: { status: newStatus },
      });

      return {
        message: `Estado del producto actualizado a ${newStatus}`,
        data: updated,
      };
    } catch (error) {
      this.logger.error(`Error al cambiar estado del producto ${id}`, error);
      throw error;
    }
  }
}
