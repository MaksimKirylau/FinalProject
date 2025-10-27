import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestLogger implements NestMiddleware {
    private readonly logger = new Logger(RequestLogger.name);

    use(request: Request, response: Response, next: NextFunction) {
        const { method, originalUrl } = request;
        const start = Date.now();

        response.on('finish', () => {
            const { statusCode } = response;
            const elapsed = Date.now() - start;
            this.logger.log(
                `${method} ${originalUrl} ${statusCode} - ${elapsed}ms`
            );
        });

        next();
    }
}
