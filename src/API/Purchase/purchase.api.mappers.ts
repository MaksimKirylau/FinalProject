import { Injectable } from '@nestjs/common';
import { IPurchaseApiMappers } from './purchase.api.interfaces';
import { PurchaseDto } from '../../Domain/Purchase/purchase.dto';
import { PurchasePresentationDto } from './purchase.api.dto';

@Injectable()
export class PurchaseApiMapper implements IPurchaseApiMappers {
    public purchaseToPresentation(dto: PurchaseDto): PurchasePresentationDto {
        return {
            purchaseId: dto.purchaseId,
            status: dto.status,
        };
    }
}
