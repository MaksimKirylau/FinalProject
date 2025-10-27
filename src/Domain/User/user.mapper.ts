import { Injectable } from '@nestjs/common';
import { UserEntity } from './repository/user.repository.model';
import { UserDto, UserWithPurchasesDto } from '../../Domain/User/user.dto';
import { IUserMappers } from './user.interfaces';

@Injectable()
export class UserMappers implements IUserMappers {
    public userEntityToUser(dto: UserEntity): UserDto {
        return {
            userId: dto.userId || dto.dataValues.userId,
            role: dto.dataValues.role,
            isOAuthUser: dto.dataValues.isOAuthUser,
            email: dto.dataValues.email,
            password: dto.dataValues.password,
            image: dto.dataValues.image,
            refreshToken: dto.dataValues.refreshToken,
            firstName: dto.dataValues.firstName,
            lastName: dto.dataValues.lastName,
            birthDate: dto.dataValues.birthDate,
            createdAt: dto.dataValues.createdAt,
            updatedAt: dto.dataValues.updatedAt,
        };
    }

    public userEntityToUserWithPurchases(
        dto: UserEntity
    ): UserWithPurchasesDto {
        return {
            userId: dto.userId || dto.dataValues.userId,
            role: dto.dataValues.role,
            isOAuthUser: dto.dataValues.isOAuthUser,
            email: dto.dataValues.email,
            password: dto.dataValues.password,
            image: dto.dataValues.image,
            refreshToken: dto.dataValues.refreshToken,
            firstName: dto.dataValues.firstName,
            lastName: dto.dataValues.lastName,
            birthDate: dto.dataValues.birthDate,
            createdAt: dto.dataValues.createdAt,
            updatedAt: dto.dataValues.updatedAt,
            purchases:
                dto.dataValues.purchases?.map((purchaseEntity) => {
                    const record = purchaseEntity?.dataValues?.record;
                    return record ? record.dataValues?.name : null;
                }) ?? [],
        };
    }
}
