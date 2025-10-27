export class CreateOAuthUserDto {
    providerId: string;
    email: string;
    firstName: string;
    lastName: string;
}

export class GoogleConfig {
    clientId: string;
    clientSecret: string;
    callbackURL: string;
    scope: string[];
    authURL: string;
    tokenURL: string;
    userInfoURL: string;
}
