import { Module } from '@nestjs/common';
import { getConnectionToken, SequelizeModule } from '@nestjs/sequelize';
import { Dialect } from 'sequelize';
import { SEQUELIZE } from './database.constants';
import { UserEntity } from '../Domain/User/repository/user.repository.model';
import { RecordEntity } from '../Domain/Record/repository/record.repository.model';
import { ReviewEntity } from '../Domain/Review/repository/review.model';
import { PurchaseEntity } from '../Domain/Purchase/repository/purchase.repository.model';
import { OAuthAccountEntity } from '../Domain/OAuthAccount/repository/oauthAccount.repository.model';

@Module({
    controllers: [],
    providers: [{ provide: SEQUELIZE, useExisting: getConnectionToken() }],
    imports: [
        SequelizeModule.forRootAsync({
            useFactory: () => ({
                dialect: process.env.MYSQL_DIALECT as Dialect,
                host: process.env.MYSQL_HOST,
                port: Number(process.env.MYSQL_PORT),
                username: process.env.MYSQL_USERNAME,
                password: process.env.MYSQL_ROOT_PASSWORD,
                database: process.env.MYSQL_DATABASE,
                models: [
                    UserEntity,
                    RecordEntity,
                    ReviewEntity,
                    PurchaseEntity,
                    OAuthAccountEntity,
                ],
                autoLoadModels: true,
                synchronize: true,
            }),
        }),
    ],
    exports: [SEQUELIZE],
})
export class DatabaseModule {}
