import { Injectable } from '@nestjs/common';
import {
    UserPresentationDto,
    UserWithPurchsesPresentationDto,
} from '../../API/User/user.api.dto';
import { UserDto, UserWithPurchasesDto } from '../../Domain/User/user.dto';
import { IUserApiMapper } from './user.api.interfaces';

@Injectable()
export class UserApiMapper implements IUserApiMapper {
    public userToPresentation(dto: UserDto): UserPresentationDto {
        return {
            userId: dto.userId,
            role: dto.role,
            email: dto.email,
            image: dto.image,
            firstName: dto.firstName,
            lastName: dto.lastName,
            birthDate: dto.birthDate,
            createdAt: dto.createdAt,
        };
    }

    public userWithPurchasesToPresentation(
        dto: UserWithPurchasesDto
    ): UserWithPurchsesPresentationDto {
        return {
            userId: dto.userId,
            role: dto.role,
            email: dto.email,
            image: dto.image,
            firstName: dto.firstName,
            lastName: dto.lastName,
            birthDate: dto.birthDate,
            createdAt: dto.createdAt,
            purcases: dto.purchases,
        };
    }
}
