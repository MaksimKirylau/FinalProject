import { Module } from '@nestjs/common';
import {
    OAUTH_ACCOUNT_MAPPERS,
    OAUTH_ACCOUNT_REPOSITORY,
    OAUTH_ACCOUNT_SERVICE,
} from './oauthAccount.constants';
import { OAuthAccountService } from './oauthAccount.service';
import { OAuthAccountRepository } from './repository/oauthAccount.repository';
import { OAuthAccountMappers } from './oauthAccount.mappers';
import { DatabaseModule } from '../../Database/database.module';
import { OAuthAccountEntity } from './repository/oauthAccount.repository.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserEntity } from '../User/repository/user.repository.model';

@Module({
    providers: [
        { provide: OAUTH_ACCOUNT_SERVICE, useClass: OAuthAccountService },
        { provide: OAUTH_ACCOUNT_REPOSITORY, useClass: OAuthAccountRepository },
        { provide: OAUTH_ACCOUNT_MAPPERS, useClass: OAuthAccountMappers },
    ],
    imports: [
        DatabaseModule,
        SequelizeModule.forFeature([OAuthAccountEntity, UserEntity]),
    ],
    exports: [OAUTH_ACCOUNT_SERVICE],
})
export class OAuthAccountModule {}
