import { RequestUserDto, TokenDto } from './auth.dto';
import { CreateUserDto } from '../../API/User/user.api.dto';

export interface IAuthService {
    validateUser(email: string, pass: string);
    login(requestUser: RequestUserDto): Promise<TokenDto>;
    logout(userId: number): Promise<void>;
    refreshTokens(userId: number, refreshToken: string): Promise<TokenDto>;
    register(dto: CreateUserDto, image): Promise<TokenDto>;
}
