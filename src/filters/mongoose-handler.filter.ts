import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import mongoose, { Error as MongooseError } from 'mongoose';

@Catch(
  mongoose.mongo.MongoServerError,
  MongooseError,
  mongoose.mongo.MongoError,
)
export class MongooseErrorFilter implements ExceptionFilter {
  private readonly logger = new Logger(MongooseErrorFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    this.logger.error(`Exception caught: ${exception.message}`);

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof MongooseError.ValidationError) {
      status = HttpStatus.BAD_REQUEST;
      message = exception.message;
    } else if (exception instanceof MongooseError.CastError) {
      status = HttpStatus.BAD_REQUEST;
      message = `Invalid ${exception.kind}: ${exception.value}`;
    } else if (exception instanceof MongooseError.DocumentNotFoundError) {
      status = HttpStatus.NOT_FOUND;
      message = 'Document not found';
    } else if (
      exception instanceof mongoose.mongo.MongoServerError &&
      exception.code === 11000
    ) {
      status = HttpStatus.CONFLICT;
      message = `Duplicate key error for key ${Object.keys(exception.keyValue)}`;
    } else if (
      exception instanceof mongoose.mongo.MongoError &&
      exception.code === 11000
    ) {
      status = HttpStatus.CONFLICT;
      message = exception.message;
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      name: exception.name,
      path: request.url,
      message: message || null,
    });
  }
}
