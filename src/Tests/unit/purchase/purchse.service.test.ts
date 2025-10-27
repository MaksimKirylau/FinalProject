import { describe, it, beforeEach, mock } from 'node:test';
import assert from 'node:assert';
import { ResourceNotFoundException } from '../../../Utility/errors/appExceptions/appException';
import { PurchaseService } from '../../../Domain/Purchase/purchase.service';
import {
    MOCK_NONEXISTENT_RECORD_ID,
    MOCK_RECORD_ID,
    mockRecord,
} from '../record/record.mock';
import {
    MOCK_NONEXISTENT_PURCHASE_ID,
    MOCK_PURCHASE_ID,
    mockCheckoutSession,
    mockCreatePurchase,
    mockPurchase,
    mockStripeEventExpired,
    mockStripeEventFailed,
    mockStripeEventSuccess,
} from './purchase.mock';
import { mockRequestUser } from '../user/user.mock';
import {
    CENT_MULTIPLIER,
    PAYMENT_FAILED,
    PAYMENT_SUCCESSFUL,
} from '../../../Domain/Purchase/purchse.constants';
import Stripe from 'stripe';

describe('PurchaseService', () => {
    let purchaseService: PurchaseService;
    let mockRecordService;
    let mockPurchaseRepository;
    let mockConfigService;
    let mockEventEmitter;
    let mockStripe;

    beforeEach(() => {
        mock.reset();

        mockRecordService = {
            getRecord: mock.fn(),
        };

        mockPurchaseRepository = {
            createPurchase: mock.fn(),
            updatePurchase: mock.fn(),
            findPurchase: mock.fn(),
        };

        mockConfigService = {
            get: mock.fn((key: string) => {
                const config = {
                    STRIPE_SECRET_KEY: 'sk_test_mock',
                    STRIPE_API_VERSION: 'apiVersion',
                    STRIPE_SUCCESS_URL: 'https://example.com/success',
                    STRIPE_CANCEL_URL: 'https://example.com/cancel',
                };
                return config[key];
            }),
        };

        mockEventEmitter = {
            emit: mock.fn(),
        };

        mockStripe = {
            checkout: {
                sessions: {
                    create: mock.fn(),
                },
            },
        };

        purchaseService = new PurchaseService(
            mockRecordService,
            mockPurchaseRepository,
            mockConfigService,
            mockEventEmitter
        );

        purchaseService['stripe'] = mockStripe as unknown as Stripe;
    });

    describe('createCheckoutSession', () => {
        it('should create checkout session successfully', async () => {
            mockRecordService.getRecord.mock.mockImplementationOnce(() =>
                Promise.resolve(mockRecord)
            );
            mockStripe.checkout.sessions.create.mock.mockImplementationOnce(
                () => Promise.resolve(mockCheckoutSession)
            );
            mockPurchaseRepository.createPurchase.mock.mockImplementationOnce(
                () => Promise.resolve()
            );

            const result = await purchaseService.createCheckoutSession(
                mockRequestUser,
                MOCK_RECORD_ID
            );

            assert.deepStrictEqual(
                mockRecordService.getRecord.mock.calls[0].arguments,
                [MOCK_RECORD_ID]
            );

            const createSessionArgs =
                mockStripe.checkout.sessions.create.mock.calls[0].arguments[0];
            assert.strictEqual(
                createSessionArgs.line_items[0].price_data.product_data.name,
                mockRecord.name
            );
            assert.strictEqual(
                createSessionArgs.line_items[0].price_data.unit_amount,
                mockRecord.price * CENT_MULTIPLIER
            );
            assert.strictEqual(
                createSessionArgs.metadata.userId,
                mockRequestUser.userId
            );
            assert.strictEqual(
                createSessionArgs.metadata.email,
                mockRequestUser.email
            );
            assert.strictEqual(
                createSessionArgs.metadata.recordId,
                MOCK_RECORD_ID
            );

            assert.deepStrictEqual(
                mockPurchaseRepository.createPurchase.mock.calls[0].arguments,
                [mockCreatePurchase]
            );

            assert.strictEqual(result, mockCheckoutSession);
        });

        it('should throw ResourceNotFoundException when record not found', async () => {
            mockRecordService.getRecord.mock.mockImplementationOnce(() =>
                Promise.resolve(null)
            );

            await assert.rejects(
                () =>
                    purchaseService.createCheckoutSession(
                        mockRequestUser,
                        MOCK_NONEXISTENT_RECORD_ID
                    ),
                (error) => {
                    assert.ok(error instanceof ResourceNotFoundException);
                    assert.strictEqual(
                        error.message,
                        `record with identifier ${MOCK_NONEXISTENT_RECORD_ID} not found`
                    );
                    return true;
                }
            );
        });
    });

    describe('handleWebhook', () => {
        it('should handle successful payment', async () => {
            mockPurchaseRepository.updatePurchase.mock.mockImplementationOnce(
                () => Promise.resolve()
            );

            await purchaseService.handleWebhook(mockStripeEventSuccess);

            assert.deepStrictEqual(
                mockPurchaseRepository.updatePurchase.mock.calls[0].arguments,
                [mockStripeEventSuccess.data.object.id, PAYMENT_SUCCESSFUL]
            );
            assert.deepStrictEqual(
                mockEventEmitter.emit.mock.calls[0].arguments,
                [
                    'payment successful',
                    mockStripeEventSuccess.data.object.metadata.email,
                    mockStripeEventSuccess.data.object.id,
                ]
            );
        });

        it('should handle payment failure', async () => {
            mockPurchaseRepository.updatePurchase.mock.mockImplementationOnce(
                () => Promise.resolve()
            );

            await purchaseService.handleWebhook(mockStripeEventFailed);

            assert.deepStrictEqual(
                mockPurchaseRepository.updatePurchase.mock.calls[0].arguments,
                [mockStripeEventSuccess.data.object.id, PAYMENT_FAILED]
            );
        });

        it('should handle expired session', async () => {
            mockPurchaseRepository.updatePurchase.mock.mockImplementationOnce(
                () => Promise.resolve()
            );

            await purchaseService.handleWebhook(mockStripeEventExpired);

            assert.deepStrictEqual(
                mockPurchaseRepository.updatePurchase.mock.calls[0].arguments,
                [mockStripeEventSuccess.data.object.id, PAYMENT_FAILED]
            );
        });
    });

    describe('getPurchase', () => {
        it('should return purchase when found', async () => {
            mockPurchaseRepository.findPurchase.mock.mockImplementationOnce(
                () => Promise.resolve(mockPurchase)
            );

            const result = await purchaseService.getPurchase(MOCK_PURCHASE_ID);

            assert.deepStrictEqual(
                mockPurchaseRepository.findPurchase.mock.calls[0].arguments,
                [MOCK_PURCHASE_ID]
            );
            assert.strictEqual(result, mockPurchase);
        });

        it('should throw ResourceNotFoundException when purchase not found', async () => {
            mockPurchaseRepository.findPurchase.mock.mockImplementationOnce(
                () => Promise.resolve(null)
            );

            await assert.rejects(
                () => purchaseService.getPurchase(MOCK_NONEXISTENT_PURCHASE_ID),
                (error) => {
                    assert.ok(error instanceof ResourceNotFoundException);
                    assert.strictEqual(
                        error.message,
                        `purchase with identifier ${MOCK_NONEXISTENT_PURCHASE_ID} not found`
                    );
                    return true;
                }
            );
        });
    });
});
