import { UserDto, UserWithPurchasesDto } from '../../Domain/User/user.dto';
import {
    UpdateUserDto,
    UserPresentationDto,
    UserWithPurchsesPresentationDto,
} from './user.api.dto';
import { RequestUserDto } from '../../Auth/authentification/auth.dto';

export interface IUserController {
    getUser(requestUser: RequestUserDto): Promise<UserPresentationDto>;
    getUserWithPurchases(
        requestUser: RequestUserDto
    ): Promise<UserWithPurchsesPresentationDto>;
    updateUser(requestUser: RequestUserDto, dto: UpdateUserDto): Promise<void>;
    deleteUser(requestUser: RequestUserDto): Promise<void>;
}

export interface IUserApiMapper {
    userToPresentation(dto: UserDto): UserPresentationDto;
    userWithPurchasesToPresentation(
        dto: UserWithPurchasesDto
    ): UserWithPurchsesPresentationDto;
}
