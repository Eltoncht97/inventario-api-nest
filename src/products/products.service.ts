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
import { calculatePricing } from './helpers/calculate-pricing';
import { AdjustPricesDto } from './dto/adjust-prices.dto';

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

      const {
        costTotal,
        ivaValue,
        utilitiesValue,
        utilitiesPercent,
        discountValue,
        discountPercent,
        price,
      } = calculatePricing(createProductDto);

      // ✅ Crear el producto
      const product = await this.prisma.product.create({
        data: {
          ...createProductDto,
          costTotal,
          ivaValue,
          utilitiesValue,
          utilitiesPercent,
          discountValue,
          discountPercent,
          price,
        },
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
    const productDb = await this.findOne(id);

    try {
      if (updateProductDto.categoryId) {
        const categoryExists = await this.prisma.category.findUnique({
          where: { id: updateProductDto.categoryId },
        });
        if (!categoryExists) {
          throw new BadRequestException('La categoría proporcionada no existe');
        }
      }

      const shouldRecalculatePrice =
        'cost' in updateProductDto ||
        'ivaType' in updateProductDto ||
        'utilitiesPercent' in updateProductDto ||
        'utilitiesValue' in updateProductDto ||
        'discountPercent' in updateProductDto ||
        'discountValue' in updateProductDto;

      let pricingData = {};

      if (shouldRecalculatePrice) {
        pricingData = calculatePricing({
          ...productDb,
          ...updateProductDto,
        });
      }

      const product = await this.prisma.product.update({
        where: {
          id,
        },
        data: {
          ...updateProductDto,
          ...pricingData,
        },
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
        message: `Producto eliminado satisfactoriamente`,
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

      if (product.deletedAt) {
        throw new BadRequestException(
          'El producto fue eliminado y no se puede modificar',
        );
      }

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

  async adjustPrices(dto: AdjustPricesDto) {
    const { percentToAdd, categoryId } = dto;

    const whereClause = categoryId ? { categoryId } : {};

    const products = await this.prisma.product.findMany({ where: whereClause });

    const operations = products.map((product) => {
      const updatedUtilitiesPercent = product.utilitiesPercent + percentToAdd;

      const {
        ivaValue,
        utilitiesValue,
        discountPercent,
        discountValue,
        price,
        costTotal,
      } = calculatePricing({
        ...product,
        utilitiesPercent: updatedUtilitiesPercent,
      });

      return this.prisma.product.update({
        where: { id: product.id },
        data: {
          utilitiesPercent: updatedUtilitiesPercent,
          utilitiesValue,
          ivaValue,
          discountPercent,
          discountValue,
          price,
          costTotal,
        },
      });
    });

    const result = await this.prisma.$transaction(operations);

    return {
      message: 'Precios actualizados con éxito',
      count: result.length,
    };
  }
}
