import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { TELEGRAM_SERVICE } from './telegram.constants';

@Module({
    imports: [],
    providers: [{ provide: TELEGRAM_SERVICE, useClass: TelegramService }],
    exports: [TELEGRAM_SERVICE],
})
export class TelegramModule {}
