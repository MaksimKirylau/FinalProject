import { Module } from '@nestjs/common';
import { UserModule } from '../Domain/User/user.module';
import { USER_API_MAPPER } from './User/user.api.constants';
import { UserApiMapper } from './User/user.api.mapper';
import { AuthModule } from '../Auth/authentification/auth.module';
import { CaslModule } from '../Auth/authorization/casl.module';
import { UserController } from './User/user.controller';
import { RecordController } from './Record/record.controller';
import { RecordModule } from '../Domain/Record/record.module';
import { RECORD_API_MAPPER } from './Record/record.api.constants';
import { RecordApiMapper } from './Record/record.api.mapper';
import { ReviewController } from './Review/review.controller';
import { ReviewModule } from '../Domain/Review/review.module';
import { REVIEW_API_MAPPER } from './Review/review.api.constants';
import { ReviewApiMapper } from './Review/review.api.mapper';
import { PurchaseController } from './Purchase/purchase.controller';
import { PurchaseModule } from '../Domain/Purchase/purchase.module';
import { PURCHASE_API_MAPPERS } from './Purchase/purchase.api.constatnts';
import { PurchaseApiMapper } from './Purchase/purchase.api.mappers';

@Module({
    controllers: [
        UserController,
        RecordController,
        ReviewController,
        PurchaseController,
    ],
    providers: [
        { provide: USER_API_MAPPER, useClass: UserApiMapper },
        { provide: RECORD_API_MAPPER, useClass: RecordApiMapper },
        { provide: REVIEW_API_MAPPER, useClass: ReviewApiMapper },
        { provide: PURCHASE_API_MAPPERS, useClass: PurchaseApiMapper },
    ],
    imports: [
        UserModule,
        RecordModule,
        ReviewModule,
        AuthModule,
        CaslModule,
        PurchaseModule,
    ],
    exports: [],
})
export class ApiModule {}
