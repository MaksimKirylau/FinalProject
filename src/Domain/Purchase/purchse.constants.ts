import { PaymentStatus } from './purchase.interface';

export const PURCHASE_SERVICE = Symbol('PURCHASE_SERVICE');
export const PURCHASE_REPOSITORY = Symbol('PURCHASE_REPOSITORY');
export const PURCHASE_MAPPERS = Symbol('PURCHASE_MAPPERS');

export const CENT_MULTIPLIER: number = 100;

export const PAYMENT_SUCCESSFUL: PaymentStatus = 'paid';
export const PAYMENT_FAILED: PaymentStatus = 'failed';
