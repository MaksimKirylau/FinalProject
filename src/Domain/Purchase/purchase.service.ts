import { Inject, Injectable, Logger } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { RecordDto } from '../Record/record.dto';
import { RECORD_SERVICE } from '../Record/record.constants';
import type { IRecordService } from '../Record/record.interfaces';
import {
    CENT_MULTIPLIER,
    PAYMENT_FAILED,
    PAYMENT_SUCCESSFUL,
    PURCHASE_REPOSITORY,
} from './purchse.constants';
import type {
    IPurchaseRepository,
    IPurchaseService,
} from './purchase.interface';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RequestUserDto } from '../../Auth/authentification/auth.dto';
import { PurchaseDto } from './purchase.dto';
import { ResourceNotFoundException } from '../../Utility/errors/appExceptions/appException';
import { Optional } from '../../Utility/global.types';
import { CreatePurchaseDto } from '../../API/Purchase/purchase.api.dto';

@Injectable()
export class PurchaseService implements IPurchaseService {
    private stripe: Stripe;
    private readonly logger = new Logger(PurchaseService.name);

    constructor(
        @Inject(RECORD_SERVICE) private readonly recordService: IRecordService,
        @Inject(PURCHASE_REPOSITORY)
        private readonly purchaseRepository: IPurchaseRepository,
        private readonly configService: ConfigService,
        private readonly eventEmitter: EventEmitter2
    ) {
        this.stripe = new Stripe(
            this.configService.get('STRIPE_SECRET_KEY')!,
            this.configService.get('STRIPE_API_VERSION')
        );
    }

    async createCheckoutSession(
        requestUser: RequestUserDto,
        recordId: number
    ): Promise<Stripe.Response<Stripe.Checkout.Session>> {
        this.logger.log(`Creating purchase for record: ${recordId}`);

        const record: RecordDto = await this.recordService.getRecord(recordId);

        if (!record) {
            throw new ResourceNotFoundException('record', recordId);
        }

        const session = await this.stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: { name: record.name },
                        unit_amount: record.price * CENT_MULTIPLIER,
                    },
                    quantity: 1,
                },
            ],
            success_url: this.configService.get('STRIPE_SUCCESS_URL'),
            cancel_url: this.configService.get('STRIPE_CANCEL_URL'),
            metadata: {
                userId: requestUser.userId,
                email: requestUser.email,
                recordId: record.recordId,
            },
        });

        const purchase: CreatePurchaseDto = {
            userId: requestUser.userId,
            recordId: recordId,
            sessionId: session.id,
        };

        await this.purchaseRepository.createPurchase(purchase);

        this.logger.log(
            `Purchase created successfully: sessionid=${purchase.sessionId}`
        );
        return session;
    }

    async handleWebhook(event: Stripe.Event) {
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;

            this.logger.log(`Updating purchase status id=${session.id}`);
            await this.purchaseRepository.updatePurchase(
                session.id,
                PAYMENT_SUCCESSFUL
            );

            this.logger.log(`Purchase successful: id=${session.id}`);
            this.eventEmitter.emit(
                'payment successful',
                session.metadata!.email,
                session.id
            );
        }

        if (
            event.type === 'checkout.session.async_payment_failed' ||
            event.type === 'checkout.session.expired'
        ) {
            const session = event.data.object;

            this.logger.log(`Updating purchase status id=${session.id}`);
            await this.purchaseRepository.updatePurchase(
                session.id,
                PAYMENT_FAILED
            );

            this.logger.log(`Purchase failed: id=${session.id}`);
        }
    }

    async getPurchase(purchaseId: number): Promise<PurchaseDto> {
        const purchase: Optional<PurchaseDto> =
            await this.purchaseRepository.findPurchase(purchaseId);

        if (!purchase) {
            throw new ResourceNotFoundException('purchase', purchaseId);
        }

        return purchase;
    }
}
