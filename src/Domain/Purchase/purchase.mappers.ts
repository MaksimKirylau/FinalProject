import { Injectable } from '@nestjs/common';
import { IPurchaseMappers } from './purchase.interface';
import { PurchaseEntity } from './repository/purchase.repository.model';
import { PurchaseDto } from './purchase.dto';

@Injectable()
export class PurchaseMappers implements IPurchaseMappers {
    public purchaseEntityToPurchase(dto: PurchaseEntity): PurchaseDto {
        return {
            purchaseId: dto.dataValues.purchaseId,
            userId: dto.dataValues.userId,
            recordId: dto.dataValues.recordId,
            sessionId: dto.dataValues.sessionId,
            status: dto.dataValues.status,
        };
    }
}
