import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
  InternalServerErrorException,
  HttpException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    console.log('Entra al Prisma Exception');
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let httpException: HttpException;

    switch (exception.code) {
      case 'P2002':
        httpException = new BadRequestException(
          'Ya existe un registro con los mismos datos únicos',
        );
        break;
      case 'P2003':
        httpException = new BadRequestException(
          'Referencia inválida. Verifique los campos relacionados',
        );
        break;
      case 'P2025':
        httpException = new BadRequestException('El registro no existe');
        break;
      default:
        httpException = new InternalServerErrorException(
          'Error de base de datos',
        );
    }

    const status = httpException.getStatus();
    const timestamp = new Date().toISOString();

    response.status(status).json({
      success: false,
      timestamp,
      statusCode: status,
      message: httpException.message,
    });
  }
}
