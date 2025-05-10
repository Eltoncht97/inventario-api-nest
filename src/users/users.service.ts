import {
  Injectable,
  BadRequestException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, ...rest } = createUserDto;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException('El correo electrónico ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return this.prisma.user.create({
      data: {
        ...rest,
        email,
        password: hashedPassword,
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findAll(filterDto: FilterUserDto) {
    try {
      const { page = 1, limit = 10, status } = filterDto;

      const skip = (page - 1) * limit;

      const filters: Prisma.UserWhereInput = {
        deletedAt: null,
        ...(status ? { status } : {}),
      };

      const [totalRecords, users] = await Promise.all([
        this.prisma.user.count({ where: filters }),
        this.prisma.user.findMany({
          where: filters,
          skip,
          take: limit,
          orderBy: { name: 'asc' },
        }),
      ]);

      return {
        users,
        meta: {
          total: totalRecords,
          page,
          lastPage: Math.ceil(totalRecords / limit),
        },
      };
    } catch (error) {
      this.logger.error('Error al listar usuarios', error);
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new NotFoundException(`Usuario #${id} no encontrado`);
      }

      return user;
    } catch (error) {
      this.logger.error(`Error al buscar el usuario ${id}`, error);
      throw error;
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async updateRefreshToken(userId: string, token: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: token },
    });
  }
}
