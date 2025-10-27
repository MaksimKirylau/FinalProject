import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AUTH_SERVICE } from '../auth.constants';
import type { IAuthService } from '../auth.interfaces';
import { UserDto } from '../../../Domain/User/user.dto';
import { RequestUserDto } from '../auth.dto';
import { AuthenticationException } from '../../../Utility/errors/appExceptions/appException';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(
        @Inject(AUTH_SERVICE) private readonly authService: IAuthService
    ) {
        super({
            usernameField: 'email',
        });
    }

    async validate(email: string, password: string): Promise<RequestUserDto> {
        const user: UserDto = await this.authService.validateUser(
            email,
            password
        );

        if (!user) {
            throw new AuthenticationException();
        }

        const requestUser: RequestUserDto = {
            userId: user.userId,
            email: user.email,
            role: user.role,
        };

        return requestUser;
    }
}
