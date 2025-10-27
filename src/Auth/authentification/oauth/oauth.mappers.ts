import { Injectable } from '@nestjs/common';
import { CreateOAuthUserDto } from './oauth.dto';
import { IOAuthMappers } from './oauth.interfaces';

@Injectable()
export class OAuthMappers implements IOAuthMappers {
    public googleUserToOAuthUser(googleUser): CreateOAuthUserDto {
        return {
            providerId: googleUser.id,
            email: googleUser.email,
            firstName: googleUser.given_name ?? 'John',
            lastName: googleUser.family_name ?? 'Smith',
        };
    }
}
