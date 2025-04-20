import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { FilterCategoryDto } from './dto/filter-category.dto';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);

  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const category = await this.prisma.category.create({
        data: createCategoryDto,
      });

      return {
        message: 'Categoría creada correctamente',
        data: category,
      };
    } catch (error) {
      this.logger.error('Error en la creación de la categoría', error);
      throw error;
    }
  }

  async findAll(filterDto: FilterCategoryDto) {
    try {
      const { page = 1, limit = 10, status } = filterDto;

      const skip = (page - 1) * limit;

      const filters: Prisma.CategoryWhereInput = {
        deletedAt: null,
        ...(status ? { status } : {}),
      };

      const [totalRecords, categories] = await Promise.all([
        this.prisma.category.count({ where: filters }),
        this.prisma.category.findMany({
          where: filters,
          skip,
          take: limit,
          orderBy: { name: 'asc' },
        }),
      ]);

      return {
        categories,
        meta: {
          total: totalRecords,
          page,
          lastPage: Math.ceil(totalRecords / limit),
        },
      };
    } catch (error) {
      this.logger.error('Error al listar categorías', error);
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const category = await this.prisma.category.findUnique({
        where: { id },
      });

      if (!category) {
        throw new NotFoundException(`Categoría #${id} no encontrada`);
      }

      return category;
    } catch (error) {
      this.logger.error(`Error al buscar categoría ${id}`, error);
      throw error;
    }
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    await this.findOne(id);

    try {
      const category = await this.prisma.category.update({
        where: {
          id,
        },
        data: updateCategoryDto,
      });

      return {
        message: 'Categoría actualizada correctamente',
        data: category,
      };
    } catch (error) {
      this.logger.error(`Error al actualizar la categoría ${id}`, error);
      throw error;
    }
  }

  async remove(id: string) {
    try {
      await this.findOne(id);
      const category = await this.prisma.category.update({
        where: { id },
        data: {
          deletedAt: new Date(),
        },
      });
      return {
        message: `Categoría ${id} eliminada satisfactoriamente`,
        data: category,
      };
    } catch (error) {
      this.logger.error(`Error al eliminar la categoría ${id}`, error);
      throw error;
    }
  }

  async toggleStatus(id: string) {
    try {
      const category = await this.findOne(id); // ya valida existencia

      const newStatus = category.status === 'activo' ? 'inactivo' : 'activo';

      const updated = await this.prisma.category.update({
        where: { id },
        data: { status: newStatus },
      });

      return {
        message: `Estado de la categoría actualizado a ${newStatus}`,
        data: updated,
      };
    } catch (error) {
      this.logger.error(`Error al cambiar estado de la categoría ${id}`, error);
      throw error;
    }
  }
}
