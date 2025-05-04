import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany({
      // where: { deleted: false },
      orderBy: { createdAt: 'desc' },
    });
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
