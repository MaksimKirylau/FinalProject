import {
    Controller,
    Get,
    Headers,
    HttpStatus,
    Inject,
    Param,
    ParseIntPipe,
    Post,
    Req,
} from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import type { Request } from 'express';
import { RequestUserDto } from '../../Auth/authentification/auth.dto';
import type { IPurchaseService } from '../../Domain/Purchase/purchase.interface';
import { PURCHASE_SERVICE } from '../../Domain/Purchase/purchse.constants';
import { Public } from '../../Utility/decorators/public.decorator';
import { RequestUser } from '../../Utility/decorators/user.decorator';
import Stripe from 'stripe';
import type {
    IPurchaseApiMappers,
    IPurchaseController,
} from './purchase.api.interfaces';
import { PurchaseDto } from '../../Domain/Purchase/purchase.dto';
import { PurchasePresentationDto } from './purchase.api.dto';
import { PURCHASE_API_MAPPERS } from './purchase.api.constatnts';
import { ConfigService } from '@nestjs/config';
import { ValidationException } from '../../Utility/errors/appExceptions/appException';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('purchase')
export class PurchaseController implements IPurchaseController {
    private stripe: Stripe;

    constructor(
        @Inject(PURCHASE_SERVICE)
        private readonly purchaseService: IPurchaseService,
        @Inject(PURCHASE_API_MAPPERS)
        private readonly purchaseApiMappers: IPurchaseApiMappers,
        private readonly configService: ConfigService
    ) {
        this.stripe = new Stripe(
            this.configService.get('STRIPE_SECRET_KEY')!,
            this.configService.get('STRIPE_API_VERSION')
        );
    }

    @ApiOperation({ summary: 'Create checkout session.' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Returns a stripe link',
    })
    @Get('/record/:id')
    async createCheckoutSession(
        @RequestUser() requestUser: RequestUserDto,
        @Param('id', ParseIntPipe) recordId: number
    ): Promise<{ url: string }> {
        const session = await this.purchaseService.createCheckoutSession(
            requestUser,
            recordId
        );
        return { url: session.url! };
    }

    @ApiOperation({
        summary: 'Upon successful completion of payment you redirected here.',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'Just a message' })
    @Get('/success')
    paymentSuccessful(): string {
        return 'now you have your record';
    }

    @ApiOperation({ summary: 'After failed payment you redirected here.' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Just a message' })
    @Get('/cancel')
    paymentCanceled(): string {
        return 'something went wrong while processing payment, try again';
    }

    @ApiOperation({ summary: 'Webhook for payment confirmation' })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Returns confirmation object',
    })
    @Public()
    @Post('/webhook')
    async stripeWebhook(
        @Headers('stripe-signature') signature: string,
        @Req() request: RawBodyRequest<Request>
    ) {
        const payload = request.rawBody;

        if (!payload) {
            throw new ValidationException('Missing raw body');
        }

        try {
            const event = this.stripe.webhooks.constructEvent(
                payload,
                signature,
                this.configService.get('STRIPE_WEBHOOK_SECRET')!
            );
            await this.purchaseService.handleWebhook(event);
            return { received: true };
        } catch (error) {
            throw new ValidationException('Invalid signature', error);
        }
    }

    @ApiOperation({ summary: 'Endpoint for purchase check' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Returns info about purchase',
        type: PurchasePresentationDto,
    })
    @Get('/:id')
    async getPurchase(
        @Param('id', ParseIntPipe) purchaseId: number
    ): Promise<PurchasePresentationDto> {
        const purchase: PurchaseDto =
            await this.purchaseService.getPurchase(purchaseId);
        const purchasePresentation: PurchasePresentationDto =
            this.purchaseApiMappers.purchaseToPresentation(purchase);
        return purchasePresentation;
    }
}
