import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HandleErrors implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    // Host data
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    // Exception data
    const status = exception.response.statusCode;
    const message = exception.response.message;

    response.status(status).json({
      statusCode: status,
      message: message,
    });
  }
}
