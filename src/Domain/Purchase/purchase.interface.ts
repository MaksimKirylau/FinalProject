import Stripe from 'stripe';
import { PurchaseDto } from './purchase.dto';
import { RequestUserDto } from '../../Auth/authentification/auth.dto';
import { PurchaseEntity } from './repository/purchase.repository.model';
import { Optional } from '../../Utility/global.types';
import { CreatePurchaseDto } from '../../API/Purchase/purchase.api.dto';

export interface IPurchaseService {
    createCheckoutSession(
        requestUser: RequestUserDto,
        recordId: number
    ): Promise<Stripe.Response<Stripe.Checkout.Session>>;
    handleWebhook(event: Stripe.Event): Promise<void>;
    getPurchase(purchaseId: number): Promise<PurchaseDto>;
}

export interface IPurchaseRepository {
    createPurchase(dto: CreatePurchaseDto): Promise<void>;
    findPurchase(purchaseId: number): Promise<Optional<PurchaseDto>>;
    updatePurchase(sessionId: string, status: PaymentStatus): Promise<void>;
}

export interface IPurchaseMappers {
    purchaseEntityToPurchase(dto: PurchaseEntity): PurchaseDto;
}

export type PaymentStatus = 'pending' | 'paid' | 'failed';
