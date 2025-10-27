import { describe, it, beforeEach, mock } from 'node:test';
import assert from 'node:assert';
import { PurchaseRepository } from '../../../Domain/Purchase/repository/purchase.repository';
import {
    MOCK_NONEXISTENT_PURCHASE_ID,
    MOCK_PURCHASE_ID,
    MOCK_SESSION_ID,
    mockCreatePurchase,
    mockPurchase,
    mockPurchaseEntity,
} from './purchase.mock';
import { PAYMENT_SUCCESSFUL } from '../../../Domain/Purchase/purchse.constants';

describe('PurchaseRepository', () => {
    let purchaseRepository: PurchaseRepository;
    let mockPurchaseDb;
    let mockPurchaseMappers;

    beforeEach(() => {
        mock.reset();

        mockPurchaseDb = {
            create: mock.fn(),
            update: mock.fn(),
            findOne: mock.fn(),
        };

        mockPurchaseMappers = {
            purchaseEntityToPurchase: mock.fn(),
        };

        purchaseRepository = new PurchaseRepository(
            mockPurchaseDb,
            mockPurchaseMappers
        );
    });

    describe('createPurchase', () => {
        it('should create purchase successfully', async () => {
            mockPurchaseDb.create.mock.mockImplementationOnce(() =>
                Promise.resolve()
            );

            await purchaseRepository.createPurchase(mockCreatePurchase);

            assert.deepStrictEqual(
                mockPurchaseDb.create.mock.calls[0].arguments,
                [mockCreatePurchase]
            );
        });
    });

    describe('updatePurchase', () => {
        it('should update purchase status by sessionId', async () => {
            mockPurchaseDb.update.mock.mockImplementationOnce(() =>
                Promise.resolve()
            );

            await purchaseRepository.updatePurchase(
                MOCK_SESSION_ID,
                PAYMENT_SUCCESSFUL
            );

            assert.deepStrictEqual(
                mockPurchaseDb.update.mock.calls[0].arguments,
                [
                    { status: PAYMENT_SUCCESSFUL },
                    { where: { sessionId: MOCK_SESSION_ID } },
                ]
            );
        });
    });

    describe('findPurchase', () => {
        it('should return PurchaseDto when purchase is found', async () => {
            mockPurchaseDb.findOne.mock.mockImplementationOnce(() =>
                Promise.resolve(mockPurchaseEntity)
            );
            mockPurchaseMappers.purchaseEntityToPurchase.mock.mockImplementationOnce(
                () => mockPurchase
            );

            const result =
                await purchaseRepository.findPurchase(MOCK_PURCHASE_ID);

            assert.deepStrictEqual(
                mockPurchaseDb.findOne.mock.calls[0].arguments,
                [{ where: { purchaseId: MOCK_PURCHASE_ID } }]
            );
            assert.deepStrictEqual(
                mockPurchaseMappers.purchaseEntityToPurchase.mock.calls[0]
                    .arguments,
                [mockPurchaseEntity]
            );
            assert.strictEqual(result, mockPurchase);
        });

        it('should return null when purchase is not found', async () => {
            mockPurchaseDb.findOne.mock.mockImplementationOnce(() =>
                Promise.resolve(null)
            );

            const result = await purchaseRepository.findPurchase(
                MOCK_NONEXISTENT_PURCHASE_ID
            );

            assert.strictEqual(result, null);
        });
    });
});
