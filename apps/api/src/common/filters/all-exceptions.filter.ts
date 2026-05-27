import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * Global exception filter.
 * - 4xx (HttpException): pass through the client-facing message (e.g. validation errors).
 * - 5xx / unknown: log the real error server-side, return a generic message so internal
 *   details (SMTP errors, stack traces, DB errors) never leak to clients.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('Exception');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    if (status >= 500) {
      this.logger.error(
        `${request.method} ${request.url} -> ${status}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
      response.status(status).json({
        statusCode: status,
        message: 'Internal server error',
      });
      return;
    }

    const payload =
      exception instanceof HttpException
        ? exception.getResponse()
        : { message: 'Request failed' };

    response
      .status(status)
      .json(
        typeof payload === 'string' ? { statusCode: status, message: payload } : payload,
      );
  }
}
