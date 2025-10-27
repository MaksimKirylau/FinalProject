import { Inject } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EmailService } from '../../Utility/services/email.service';
import { EMAIL_SERVICE } from '../../Utility/utility.constants';

export class EventHandler {
    constructor(
        @Inject(EMAIL_SERVICE) private readonly emailService: EmailService
    ) {}

    @OnEvent('payment successful')
    async handlePaymentSuccessful(email: string, sessionId: string) {
        this.emailService.sendEmail(
            email,
            'Payment successful',
            `Your purchase has been successful. Session id N${sessionId}`
        );
    }
}
