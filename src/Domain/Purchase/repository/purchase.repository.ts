import { InjectModel } from '@nestjs/sequelize';
import { Inject, Injectable } from '@nestjs/common';
import { PurchaseEntity } from './purchase.repository.model';
import { PurchaseDto } from '../purchase.dto';
import type {
    IPurchaseMappers,
    IPurchaseRepository,
    PaymentStatus,
} from '../purchase.interface';
import { PURCHASE_MAPPERS } from '../purchse.constants';
import { Optional } from '../../../Utility/global.types';
import { CreatePurchaseDto } from '../../../API/Purchase/purchase.api.dto';

@Injectable()
export class PurchaseRepository implements IPurchaseRepository {
    constructor(
        @InjectModel(PurchaseEntity)
        private readonly purchaseDb: typeof PurchaseEntity,
        @Inject(PURCHASE_MAPPERS)
        private readonly purchaseMappers: IPurchaseMappers
    ) {}

    async createPurchase(dto: CreatePurchaseDto): Promise<void> {
        await this.purchaseDb.create(dto);
    }

    async updatePurchase(
        sessionId: string,
        status: PaymentStatus
    ): Promise<void> {
        await this.purchaseDb.update(
            { status: status },
            { where: { sessionId: sessionId } }
        );
    }

    async findPurchase(purchaseId: number): Promise<Optional<PurchaseDto>> {
        const purchaseEntity: Optional<PurchaseEntity> =
            await this.purchaseDb.findOne({
                where: { purchaseId: purchaseId },
            });

        if (purchaseEntity) {
            const purchase: PurchaseDto =
                this.purchaseMappers.purchaseEntityToPurchase(purchaseEntity);
            return purchase;
        }

        return purchaseEntity;
    }
}
