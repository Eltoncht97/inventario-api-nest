import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validate } from './config/env.validation';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { PrismaModule } from './prisma/prisma.module';
import { CustomersModule } from './customers/customers.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate,
    }),
    CategoriesModule,
    ProductsModule,
    PrismaModule,
    CustomersModule,
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
