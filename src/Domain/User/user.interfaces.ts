import { CreateUserDto, UpdateUserDto } from '../../API/User/user.api.dto';
import { UserDto, UserWithPurchasesDto } from './user.dto';
import { Optional, Role } from '../../Utility/global.types';
import { UserEntity } from './repository/user.repository.model';
import { CreateOAuthUserDto } from '../../Auth/authentification/oauth/oauth.dto';

export interface IUserService {
    createUser(dto: CreateUserDto, image): Promise<UserDto>;
    createOauthUser(dto: CreateOAuthUserDto): Promise<UserDto>;
    getUserById(userId: number): Promise<UserDto>;
    getUserByEmail(email: string): Promise<Optional<UserDto>>;
    getUserByWithPurchases(userId: number): Promise<UserWithPurchasesDto>;
    updateUser(userId: number, dto: UpdateUserDto): Promise<void>;
    updateRefreshToken(
        userId: number,
        refreshToken: Optional<string>
    ): Promise<void>;
    deleteUser(userId: number): Promise<void>;
}

export interface IUserRepository {
    createUser(dto: CreateUserDto, fileName: string): Promise<UserDto>;
    createOauthUser(dto: CreateOAuthUserDto): Promise<UserDto>;
    findUser(options: Partial<UserSearch>): Promise<Optional<UserDto>>;
    findUserWithPurchases(
        userId: number
    ): Promise<Optional<UserWithPurchasesDto>>;
    updateUser(userId: number, dtp: UpdateUserDto): Promise<void>;
    updateRefreshToken(
        userId: number,
        refreshToken: Optional<string>
    ): Promise<void>;
    destroyUser(userId: number): Promise<void>;
}

export interface IUserMappers {
    userEntityToUser(dto: UserEntity): UserDto;
    userEntityToUserWithPurchases(dto: UserEntity): UserWithPurchasesDto;
}

export type UserSearch = {
    userId: number;
    role: Role;
    isOAuthUser: boolean;
    firstName: string;
    lastName: string;
    birthDate: string;
    email: string;
    createdAt: string;
    updatedAt: string;
};
