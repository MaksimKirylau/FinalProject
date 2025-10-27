import {
    CreatePurchaseDto,
    PurchasePresentationDto,
} from '../../../API/Purchase/purchase.api.dto';
import { PurchaseDto } from '../../..//Domain/Purchase/purchase.dto';
import { PurchaseEntity } from '../../..//Domain/Purchase/repository/purchase.repository.model';

export const MOCK_SESSION_ID: string = 'sessionId';
export const MOCK_PURCHASE_ID: number = 1;
export const MOCK_NONEXISTENT_PURCHASE_ID: number = 999;

export const mockStripeSignature: string = 'testSignature';
export const mockStripePayload: Buffer<ArrayBufferLike> =
    Buffer.from('testPayload');

export const mockStripeRequest = {
    rawBody: mockStripePayload,
} as any;

export const mockStripeInvalidRequest = {
    rawBody: null,
} as any;

export const mockCheckoutSession = {
    id: 'sessionId',
    url: 'https://checkout.stripe.com/c/pay/checkoutSessionUrl',
    metadata: {
        userId: 1,
        email: 'mail@mail.ru',
        recordId: 1,
    },
};

export const mockStripeEventSuccess = {
    type: 'checkout.session.completed',
    data: { object: mockCheckoutSession },
} as any;

export const mockStripeEventFailed = {
    type: 'checkout.session.async_payment_failed',
    data: { object: mockCheckoutSession },
} as any;

export const mockStripeEventExpired = {
    type: 'checkout.session.expired',
    data: { object: mockCheckoutSession },
} as any;

export const mockCreatePurchase: CreatePurchaseDto = {
    userId: 1,
    recordId: 1,
    sessionId: 'sessionId',
};

export const mockPurchase: PurchaseDto = {
    purchaseId: 1,
    userId: 1,
    recordId: 1,
    sessionId: 'sessionId',
    status: 'paid',
};

export const mockPurchaseEntity: PurchaseEntity = {
    dataValues: {
        purchaseId: 1,
        userId: 1,
        recordId: 1,
        sessionId: 'sessionId',
        status: 'paid',
    },
} as PurchaseEntity;

export const mockPurcahsePresentation: PurchasePresentationDto = {
    purchaseId: 1,
    status: 'paid',
};
