import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
    private transporter;

    constructor(private readonly configService: ConfigService) {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: this.configService.get('GOOGLE_EMAIL'),
                pass: this.configService.get('GOOGLE_APP_PASSWORD'),
            },
        });
    }

    public async sendEmail(to: string, subject: string, text: string) {
        await this.transporter.sendMail({
            from: `"Maksim Kirylau" <${this.configService.get('GOOGLE_EMAIL')}>`,
            to: `${this.configService.get('GOOGLE_EMAIL')}`,
            subject: `${subject}`,
            text: `${text}`,
            html: `<b>${text}</b>`,
        });
    }
}
