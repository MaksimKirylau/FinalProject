import { describe, it, beforeEach, mock } from 'node:test';
import assert from 'node:assert';
import Stripe from 'stripe';
import {
    mockCheckoutSession,
    mockStripeRequest,
    mockStripeEventSuccess,
    mockStripeSignature,
    mockStripePayload,
    mockStripeInvalidRequest,
    mockPurchase,
    mockPurcahsePresentation,
    MOCK_PURCHASE_ID,
} from './purchase.mock';
import { mockRequestUser } from '../user/user.mock';
import { MOCK_RECORD_ID } from '../record/record.mock';
import { ValidationException } from '../../../Utility/errors/appExceptions/appException';
import { PurchaseController } from '../../../API/Purchase/purchase.controller';

describe('PurchaseController (Refactored)', () => {
    let purchaseController: PurchaseController;
    let mockPurchaseService;
    let mockPurchaseApiMappers;
    let mockConfigService;
    let mockStripe;

    beforeEach(() => {
        mock.reset();

        mockPurchaseService = {
            createCheckoutSession: mock.fn(),
            handleWebhook: mock.fn(),
            getPurchase: mock.fn(),
        };

        mockPurchaseApiMappers = {
            purchaseToPresentation: mock.fn(),
        };

        mockConfigService = {
            get: mock.fn((key: string) => {
                const config = {
                    STRIPE_SECRET_KEY: 'sk_test_mock',
                    STRIPE_API_VERSION: 'apiVersion',
                    STRIPE_WEBHOOK_SECRET: 'whsec_mock',
                };
                return config[key];
            }),
        };

        mockStripe = {
            webhooks: {
                constructEvent: mock.fn(),
            },
        };

        purchaseController = new PurchaseController(
            mockPurchaseService,
            mockPurchaseApiMappers,
            mockConfigService
        );
        purchaseController['stripe'] = mockStripe as unknown as Stripe;
    });

    describe('createCheckoutSession', () => {
        it('should create checkout session and return URL', async () => {
            mockPurchaseService.createCheckoutSession.mock.mockImplementationOnce(
                () => Promise.resolve(mockCheckoutSession)
            );

            const result = await purchaseController.createCheckoutSession(
                mockRequestUser,
                MOCK_RECORD_ID
            );

            assert.deepStrictEqual(
                mockPurchaseService.createCheckoutSession.mock.calls[0]
                    .arguments,
                [mockRequestUser, MOCK_RECORD_ID]
            );
            assert.deepStrictEqual(result, { url: mockCheckoutSession.url });
        });
    });

    describe('stripeWebhook', () => {
        it('should process webhook successfully', async () => {
            mockStripe.webhooks.constructEvent.mock.mockImplementationOnce(
                () => mockStripeEventSuccess
            );
            mockPurchaseService.handleWebhook.mock.mockImplementationOnce(() =>
                Promise.resolve()
            );

            const result = await purchaseController.stripeWebhook(
                mockStripeSignature,
                mockStripeRequest
            );

            assert.deepStrictEqual(
                mockStripe.webhooks.constructEvent.mock.calls[0].arguments,
                [
                    mockStripePayload,
                    mockStripeSignature,
                    mockConfigService.get('STRIPE_WEBHOOK_SECRET'),
                ]
            );
            assert.deepStrictEqual(
                mockPurchaseService.handleWebhook.mock.calls[0].arguments,
                [mockStripeEventSuccess]
            );
            assert.deepStrictEqual(result, { received: true });
        });

        it('should throw ValidationException when raw body is missing', async () => {
            await assert.rejects(
                () =>
                    purchaseController.stripeWebhook(
                        mockStripeSignature,
                        mockStripeInvalidRequest
                    ),
                (error) => {
                    assert.ok(error instanceof ValidationException);
                    assert.strictEqual(error.message, 'Missing raw body');
                    return true;
                }
            );
        });

        it('should throw ValidationException when Stripe webhook verification fails', async () => {
            const stripeError = new Error('Stripe error');

            mockStripe.webhooks.constructEvent.mock.mockImplementationOnce(
                () => {
                    throw stripeError;
                }
            );

            await assert.rejects(
                () =>
                    purchaseController.stripeWebhook(
                        mockStripeSignature,
                        mockStripeRequest
                    ),
                (error) => {
                    assert.ok(error instanceof ValidationException);
                    assert.strictEqual(error.message, 'Invalid signature');
                    assert.strictEqual(error.details, stripeError);
                    return true;
                }
            );
        });
    });

    describe('getPurchase', () => {
        it('should return purchase presentation DTO', async () => {
            mockPurchaseService.getPurchase.mock.mockImplementationOnce(() =>
                Promise.resolve(mockPurchase)
            );
            mockPurchaseApiMappers.purchaseToPresentation.mock.mockImplementationOnce(
                () => mockPurcahsePresentation
            );

            const result =
                await purchaseController.getPurchase(MOCK_PURCHASE_ID);

            assert.deepStrictEqual(
                mockPurchaseService.getPurchase.mock.calls[0].arguments,
                [MOCK_PURCHASE_ID]
            );
            assert.deepStrictEqual(
                mockPurchaseApiMappers.purchaseToPresentation.mock.calls[0]
                    .arguments,
                [mockPurchase]
            );
            assert.strictEqual(result, mockPurcahsePresentation);
        });
    });
});
