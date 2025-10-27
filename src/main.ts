import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './Utility/errors/globalException.filter';
import { AppExceptionFilter } from './Utility/errors/appExceptions/appException.filter';
import { ElasticsearchTransport } from 'winston-elasticsearch';
import { WinstonModule } from 'nest-winston';
import winston from 'winston';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function start() {
    const esTransport = new ElasticsearchTransport({
        level: 'info',
        clientOpts: {
            node: process.env.ELASTIC_URL,
            auth: {
                username: process.env.ELASTIC_USER!,
                password: process.env.ELASTIC_PASSWORD!,
            },
        },
        indexPrefix: 'final-project-logs',
    });

    const logger = WinstonModule.createLogger({
        transports: [
            new winston.transports.Console({
                format: winston.format.combine(
                    winston.format.colorize(),
                    winston.format.timestamp(),
                    winston.format.printf(
                        ({ level, message, timestamp }) =>
                            `[${timestamp}] ${level}: ${message}`
                    )
                ),
            }),
            esTransport,
        ],
    });

    const PORT = Number(process.env.PORT);
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        logger,
        rawBody: true,
        bodyParser: true,
    });

    app.set('query parser', 'extended');
    app.useGlobalPipes(
        new ValidationPipe({ transform: true, whitelist: true })
    );
    app.useGlobalFilters(new GlobalExceptionFilter(), new AppExceptionFilter());

    const config = new DocumentBuilder()
        .setTitle('Final Project')
        .setDescription('Vinyl store')
        .setVersion('0.0.1')
        .addTag('Hello world')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/api/docs', app, document);

    await app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}

start();
