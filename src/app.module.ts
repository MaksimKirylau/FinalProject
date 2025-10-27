import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configuration } from '../config/configuration';
import { ApiModule } from './API/api.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from './Auth/authentification/guards/jwt.guard';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { RequestLogger } from './Utility/logging/requestLog.middleware';
import { EMAIL_SERVICE, EVENT_HANDLER } from './Utility/utility.constants';
import { EmailService } from './Utility/services/email.service';
import { EventHandler } from './Utility/events/events';

@Module({
    controllers: [],
    providers: [
        JwtGuard,
        { provide: APP_GUARD, useExisting: JwtGuard },
        { provide: EMAIL_SERVICE, useClass: EmailService },
        { provide: EVENT_HANDLER, useClass: EventHandler },
    ],
    imports: [
        ConfigModule.forRoot({
            envFilePath: `${process.cwd()}/config/env/.${process.env.NODE_ENV}.env`,
            load: [configuration],
            isGlobal: true,
        }),
        ServeStaticModule.forRoot({
            rootPath: join(process.cwd(), 'files'),
        }),
        EventEmitterModule.forRoot(),
        ApiModule,
    ],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(RequestLogger).forRoutes('*');
    }
}
