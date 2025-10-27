import { Inject, Injectable } from '@nestjs/common';
import { UserDto, UserWithPurchasesDto } from '../../../Domain/User/user.dto';
import { CreateUserDto, UpdateUserDto } from '../../../API/User/user.api.dto';
import type {
    IUserMappers,
    IUserRepository,
    UserSearch,
} from '../user.interfaces';
import { InjectModel } from '@nestjs/sequelize';
import { UserEntity } from './user.repository.model';
import { USER_MAPPERS } from '../user.constants';
import { Optional } from '../../../Utility/global.types';
import { CreateOAuthUserDto } from '../../../Auth/authentification/oauth/oauth.dto';
import { PurchaseEntity } from '../../../Domain/Purchase/repository/purchase.repository.model';
import { RecordEntity } from '../../../Domain/Record/repository/record.repository.model';

@Injectable()
export class UserRepository implements IUserRepository {
    constructor(
        @InjectModel(UserEntity) private userDb: typeof UserEntity,
        @Inject(USER_MAPPERS) private readonly userRepoMappers: IUserMappers
    ) {}

    public async createUser(
        dto: CreateUserDto,
        fileName: string
    ): Promise<UserDto> {
        const userEntity: UserEntity = await this.userDb.create({
            ...dto,
            image: fileName,
        });

        const user: UserDto = this.userRepoMappers.userEntityToUser(userEntity);
        return user;
    }

    public async createOauthUser(dto: CreateOAuthUserDto): Promise<UserDto> {
        const userEntity: UserEntity = await this.userDb.create(
            {
                email: dto.email,
                firstName: dto.firstName,
                lastName: dto.lastName,
                isOAuthUser: true,
            },
            { returning: true }
        );

        const user: UserDto = this.userRepoMappers.userEntityToUser(userEntity);
        return user;
    }

    public async findUser(
        options: Partial<UserSearch>
    ): Promise<Optional<UserDto>> {
        const userEntity: Optional<UserEntity> = await this.userDb.findOne({
            where: options,
        });

        if (userEntity) {
            const user: UserDto =
                this.userRepoMappers.userEntityToUser(userEntity);
            return user;
        }

        return userEntity;
    }

    public async findUserWithPurchases(
        userId: number
    ): Promise<Optional<UserWithPurchasesDto>> {
        const userEntity = await this.userDb.findOne({
            where: { userId: userId },
            include: [
                {
                    model: PurchaseEntity,
                    include: [{ model: RecordEntity }],
                },
            ],
        });

        if (userEntity) {
            const user = this.userRepoMappers.userEntityToUserWithPurchases(
                userEntity!
            );
            return user;
        }

        return userEntity;
    }

    public async updateUser(id: number, dto: UpdateUserDto): Promise<void> {
        await this.userDb.update(dto, { where: { userId: id } });
    }

    public async updateRefreshToken(
        id: number,
        refreshToken: Optional<string>
    ): Promise<void> {
        await this.userDb.update(
            { refreshToken: refreshToken },
            { where: { userId: id } }
        );
    }

    public async destroyUser(userId: number): Promise<void> {
        await this.userDb.destroy({ where: { userId: userId } });
    }
}
