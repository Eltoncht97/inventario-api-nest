import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpGlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const timestamp = new Date().toISOString();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Ha ocurrido un error inesperado';

    console.log('Entra al http Exception');

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const responseBody = exception.getResponse();

      // Manejo de mensajes personalizados o array de errores
      if (typeof responseBody === 'string') {
        message = responseBody;
      } else if (typeof responseBody === 'object' && responseBody !== null) {
        const res = responseBody as Record<string, any>;
        if ('message' in res) {
          if (Array.isArray(res.message)) {
            message = res.message.join(', ');
          } else if (typeof res.message === 'string') {
            message = res.message;
          }
        } else if ('error' in res && typeof res.error === 'string') {
          message = res.error;
        }
      }
    }

    response.status(status).json({
      success: false,
      timestamp,
      statusCode: status,
      message,
    });
  }
}
