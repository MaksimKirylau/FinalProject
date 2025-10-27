import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../../Domain/User/user.module';
import {
    AUTH_SERVICE,
    JWT_STRATEGY,
    LOCAL_STRATEGY,
    OAUTH_SERVICE,
} from './auth.constants';
import { LocalStrategy } from './strategies/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OAuthService } from './oauth/oauth.service';
import { GoogleOAuthProvider } from './oauth/providers/oauth.google.provider';
import { OAuthController } from './oauth/oauth.controller';
import { OAuthAccountModule } from '../../Domain/OAuthAccount/oauthAccount.module';
import { OAUTH_MAPPERS } from './oauth/oauth.constants';
import { OAuthMappers } from './oauth/oauth.mappers';
import { OAuthProviderFactory } from './oauth/providers/oauth.provider.factory';

@Module({
    controllers: [AuthController, OAuthController],
    imports: [
        UserModule,
        PassportModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get('JWT_SECRET'),
                signOptions: {
                    expiresIn: parseInt(
                        configService.getOrThrow('TOKEN_EXPIRE')
                    ),
                },
            }),
            inject: [ConfigService],
        }),
        OAuthAccountModule,
    ],
    providers: [
        { provide: AUTH_SERVICE, useClass: AuthService },
        { provide: OAUTH_SERVICE, useClass: OAuthService },
        { provide: OAUTH_MAPPERS, useClass: OAuthMappers },
        { provide: LOCAL_STRATEGY, useClass: LocalStrategy },
        { provide: JWT_STRATEGY, useClass: JwtStrategy },
        OAuthProviderFactory,
        GoogleOAuthProvider,
    ],
    exports: [AUTH_SERVICE, OAUTH_SERVICE, JWT_STRATEGY],
})
export class AuthModule {}
