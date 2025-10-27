import { CreateOAuthUserDto } from './oauth.dto';

export interface IOAuthProviderInterface {
    authorize(): string;
    callback(code: string): Promise<CreateOAuthUserDto>;
    getProviderName(): string;
}

export interface IOAuthMappers {
    googleUserToOAuthUser(googleUser): CreateOAuthUserDto;
}
