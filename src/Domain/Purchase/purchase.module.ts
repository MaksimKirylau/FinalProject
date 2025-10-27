import { Module } from '@nestjs/common';
import { RecordModule } from '../Record/record.module';
import {
    PURCHASE_MAPPERS,
    PURCHASE_REPOSITORY,
    PURCHASE_SERVICE,
} from './purchse.constants';
import { PurchaseService } from './purchase.service';
import { PurchaseRepository } from './repository/purchase.repository';
import { DatabaseModule } from '../../Database/database.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { PurchaseEntity } from './repository/purchase.repository.model';
import { UserEntity } from '../User/repository/user.repository.model';
import { RecordEntity } from '../Record/repository/record.repository.model';
import { PurchaseMappers } from './purchase.mappers';

@Module({
    imports: [
        RecordModule,
        DatabaseModule,
        SequelizeModule.forFeature([PurchaseEntity, UserEntity, RecordEntity]),
    ],
    controllers: [],
    providers: [
        { provide: PURCHASE_SERVICE, useClass: PurchaseService },
        { provide: PURCHASE_REPOSITORY, useClass: PurchaseRepository },
        { provide: PURCHASE_MAPPERS, useClass: PurchaseMappers },
    ],
    exports: [PURCHASE_SERVICE],
})
export class PurchaseModule {}
