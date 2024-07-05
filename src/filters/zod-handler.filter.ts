import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { ZodError } from 'zod';

@Catch(ZodError)
export class ZodErrorFilter<T extends ZodError> implements ExceptionFilter {
  private readonly logger = new Logger(ZodErrorFilter.name);

  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest<Request>();

    this.logger.error(`Exception caught: ${exception.message}`);

    const status = 400;

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      name: exception.name,
      path: request.url,
      errors: exception.errors || null,
    });
  }
}
