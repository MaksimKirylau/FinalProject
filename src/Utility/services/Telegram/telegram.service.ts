import { Injectable, Logger } from '@nestjs/common';
import TelegramBot from 'node-telegram-bot-api'; //there are some vulnerabilities using this package, but i dont know how to implement telegram without it
import { ConfigService } from '@nestjs/config';
import { ServiceException } from '../../../Utility/errors/appExceptions/appException';
import { ITelegramService } from './telegram.interfaces';

@Injectable()
export class TelegramService implements ITelegramService {
    private readonly logger = new Logger(TelegramService.name);
    private bot: TelegramBot;
    private chatId: string;

    constructor(private readonly configService: ConfigService) {
        const token = this.configService.get<string>('TELEGRAM_BOT_API_TOKEN')!;
        this.chatId = this.configService.get<string>('TELEGRAM_CHANNEL_ID')!;

        this.bot = new TelegramBot(token, { polling: false });
    }

    public async sendMessage(text: string): Promise<void> {
        try {
            await this.bot.sendMessage(this.chatId, text);
            this.logger.log('Message sent to telegram channel');
        } catch (error) {
            throw new ServiceException(
                'Error sending message to telegram channel',
                error.message
            );
        }
    }
}
