import { Module } from '@nestjs/common';
import { USER_MAPPERS, USER_REPOSITORY, USER_SERVICE } from './user.constants';
import { UserService } from './user.service';
import { UserRepository } from './repository/user.repository';
import { UserMappers } from './user.mapper';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserEntity } from './repository/user.repository.model';
import { ReviewEntity } from '../Review/repository/review.model';
import { PurchaseEntity } from '../Purchase/repository/purchase.repository.model';
import { RecordEntity } from '../Record/repository/record.repository.model';
import { FileModule } from '../../Utility/services/File/file.module';

@Module({
    providers: [
        { provide: USER_SERVICE, useClass: UserService },
        { provide: USER_REPOSITORY, useClass: UserRepository },
        { provide: USER_MAPPERS, useClass: UserMappers },
    ],
    imports: [
        SequelizeModule.forFeature([
            UserEntity,
            RecordEntity,
            ReviewEntity,
            PurchaseEntity,
        ]),
        FileModule,
    ],
    exports: [USER_SERVICE],
})
export class UserModule {}
