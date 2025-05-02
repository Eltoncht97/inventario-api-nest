import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { FilterCustomerDto } from './dto/filter-customer.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CustomersService {
  private readonly logger = new Logger(CustomersService.name);

  constructor(private prisma: PrismaService) {}

  async create(createCustomerDto: CreateCustomerDto) {
    try {
      const customer = await this.prisma.customer.create({
        data: createCustomerDto,
      });

      return {
        message: 'Cliente creado correctamente',
        data: customer,
      };
    } catch (error) {
      this.logger.error('Error en la creación del cliente', error);
      throw error;
    }
  }

  async findAll(filterDto: FilterCustomerDto) {
    try {
      const { page = 1, limit = 10, status } = filterDto;

      const skip = (page - 1) * limit;

      const filters: Prisma.CustomerWhereInput = {
        deletedAt: null,
        ...(status ? { status } : {}),
      };

      const [totalRecords, customers] = await Promise.all([
        this.prisma.customer.count({ where: filters }),
        this.prisma.customer.findMany({
          where: filters,
          skip,
          take: limit,
          orderBy: { name: 'asc' },
        }),
      ]);

      return {
        customers,
        meta: {
          total: totalRecords,
          page,
          lastPage: Math.ceil(totalRecords / limit),
        },
      };
    } catch (error) {
      this.logger.error('Error al listar clientes', error);
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const customer = await this.prisma.customer.findUnique({
        where: { id },
      });

      if (!customer) {
        throw new NotFoundException(`Cliente #${id} no encontrado`);
      }

      return customer;
    } catch (error) {
      this.logger.error(`Error al buscar cliente ${id}`, error);
      throw error;
    }
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto) {
    await this.findOne(id);

    try {
      const customer = await this.prisma.customer.update({
        where: {
          id,
        },
        data: updateCustomerDto,
      });

      return {
        message: 'Cliente actualizado correctamente',
        data: customer,
      };
    } catch (error) {
      this.logger.error(`Error al actualizar cliente ${id}`, error);
      throw error;
    }
  }

  async remove(id: string) {
    try {
      await this.findOne(id);
      const customer = await this.prisma.customer.update({
        where: { id },
        data: {
          deletedAt: new Date(),
        },
      });
      return {
        message: `Cliente eliminado satisfactoriamente`,
        data: customer,
      };
    } catch (error) {
      this.logger.error(`Error al eliminar cliente ${id}`, error);
      throw error;
    }
  }

  async toggleStatus(id: string) {
    try {
      const customer = await this.findOne(id); // ya valida existencia

      if (customer.deletedAt) {
        throw new BadRequestException(
          'El cliente fue eliminado y no se puede modificar',
        );
      }

      const newStatus = customer.status === 'activo' ? 'inactivo' : 'activo';

      const updated = await this.prisma.customer.update({
        where: { id },
        data: { status: newStatus },
      });

      return {
        message: `Estado del cliente actualizado a ${newStatus}`,
        data: updated,
      };
    } catch (error) {
      this.logger.error(`Error al cambiar estado del cliente ${id}`, error);
      throw error;
    }
  }
}
