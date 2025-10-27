import { RawBodyRequest } from '@nestjs/common';
import { Request } from 'express';
import { RequestUserDto } from '../../Auth/authentification/auth.dto';
import { PurchaseDto } from '../../Domain/Purchase/purchase.dto';
import { PurchasePresentationDto } from './purchase.api.dto';

export interface IPurchaseController {
    createCheckoutSession(
        requestUser: RequestUserDto,
        recordId: number
    ): Promise<{ url: string }>;
    stripeWebhook(
        signature: string,
        request: RawBodyRequest<Request>
    ): Promise<{ received: boolean }>;
    getPurchase(purchaseId: number): Promise<PurchasePresentationDto>;
    paymentSuccessful(): string;
    paymentCanceled(): string;
}

export interface IPurchaseApiMappers {
    purchaseToPresentation(dto: PurchaseDto): PurchasePresentationDto;
}
