import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { AppException } from '../../../Utility/errors/appExceptions/appException';

@Catch(AppException)
export class AppExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(AppExceptionFilter.name);

    catch(exception: AppException, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const status = exception.getStatus();
        const res = exception.getResponse() as any;

        this.logger.error(`Error: ${JSON.stringify(exception.message)}`);

        response.status(status).json({
            statusCode: status,
            errorCode: res.errorCode,
            message: res.message,
            details: res.details ?? null,
            timestamp: res.timestamp,
            path: request.url,
        });
    }
}
