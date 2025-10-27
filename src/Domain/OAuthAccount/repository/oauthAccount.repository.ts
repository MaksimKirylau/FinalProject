import { Inject, Injectable } from '@nestjs/common';
import type {
    IOAuthAccountMappers,
    IOAuthAccountRepository,
} from '../oauthAccount.interfaces';
import { InjectModel } from '@nestjs/sequelize';
import { OAuthAccountEntity } from './oauthAccount.repository.model';
import { CreateOAuthUserDto } from '../../../Auth/authentification/oauth/oauth.dto';
import { UserDto } from '../../../Domain/User/user.dto';
import { OAuthAccountDto } from '../oauthAccount.dto';
import { Optional } from '../../../Utility/global.types';
import { OAUTH_ACCOUNT_MAPPERS } from '../oauthAccount.constants';

@Injectable()
export class OAuthAccountRepository implements IOAuthAccountRepository {
    constructor(
        @InjectModel(OAuthAccountEntity)
        private oauthAccountDb: typeof OAuthAccountEntity,
        @Inject(OAUTH_ACCOUNT_MAPPERS)
        private readonly oauthAccountMappers: IOAuthAccountMappers
    ) {}

    public async createAccount(
        provider: string,
        oauthUser: CreateOAuthUserDto,
        user: UserDto
    ): Promise<void> {
        await this.oauthAccountDb.create({
            userId: user.userId,
            email: user.email,
            provider: provider,
            providerId: oauthUser.providerId,
        });
    }

    public async findAccount(
        options: Partial<OAuthAccountDto>
    ): Promise<Optional<OAuthAccountDto>> {
        const oauthAccountEntity: Optional<OAuthAccountEntity> =
            await this.oauthAccountDb.findOne({ where: options });

        if (oauthAccountEntity) {
            const oauthAccount: OAuthAccountDto =
                this.oauthAccountMappers.oauthAccountEntityToAccount(
                    oauthAccountEntity
                );
            return oauthAccount;
        }

        return oauthAccountEntity;
    }
}
