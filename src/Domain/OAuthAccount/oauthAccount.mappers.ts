import { Injectable } from '@nestjs/common';
import { IOAuthAccountMappers } from './oauthAccount.interfaces';
import { OAuthAccountDto } from './oauthAccount.dto';
import { OAuthAccountEntity } from './repository/oauthAccount.repository.model';

@Injectable()
export class OAuthAccountMappers implements IOAuthAccountMappers {
    public oauthAccountEntityToAccount(
        dto: OAuthAccountEntity
    ): OAuthAccountDto {
        return {
            oauthId: dto.dataValues.oauthId,
            userId: dto.dataValues.userId,
            email: dto.dataValues.email,
            provider: dto.dataValues.provider,
            providerId: dto.dataValues.providerId,
        };
    }
}
