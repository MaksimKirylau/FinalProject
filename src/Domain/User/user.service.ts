import { Inject, Injectable, Logger } from '@nestjs/common';
import type { IUserRepository, IUserService } from './user.interfaces';
import { UserDto, UserWithPurchasesDto } from './user.dto';
import { Optional } from '../../Utility/global.types';
import { CreateUserDto, UpdateUserDto } from '../../API/User/user.api.dto';
import { USER_REPOSITORY } from './user.constants';
import { CreateOAuthUserDto } from '../../Auth/authentification/oauth/oauth.dto';
import { FILE_SERVICE } from '../../Utility/services/File/file.constants';
import type { IFileService } from '../../Utility/services/File/file.interfaces';
import {
    ResourceNotFoundException,
    ValidationException,
} from '../../Utility/errors/appExceptions/appException';

@Injectable()
export class UserService implements IUserService {
    private readonly logger = new Logger(UserService.name);

    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
        @Inject(FILE_SERVICE) private readonly fileService: IFileService
    ) {}

    public async createUser(dto: CreateUserDto, image): Promise<UserDto> {
        this.logger.log(`Creating user with email: ${dto.email}`);

        const candidate: Optional<UserDto> = await this.userRepository.findUser(
            { email: dto.email }
        );

        if (candidate) {
            throw new ValidationException(
                'A user with this email already exists.',
                dto.email
            );
        }

        const fileName: string = await this.fileService.createFile(image);
        const user: UserDto = await this.userRepository.createUser(
            dto,
            fileName
        );

        this.logger.log(`User created successfully: id=${user.userId}`);
        return user;
    }

    public async createOauthUser(dto: CreateOAuthUserDto): Promise<UserDto> {
        this.logger.log(`Creating oauth user with email: ${dto.email}`);
        const candidate: Optional<UserDto> = await this.userRepository.findUser(
            { email: dto.email }
        );

        if (candidate) {
            throw new ValidationException(
                'A user with this email already exists.',
                dto.email
            );
        }

        const user: UserDto = await this.userRepository.createOauthUser(dto);

        this.logger.log(`User created successfully: id=${user.userId}`);
        return user;
    }

    public async getUserById(userId: number): Promise<UserDto> {
        const user: Optional<UserDto> = await this.userRepository.findUser({
            userId: userId,
        });

        if (!user) {
            throw new ResourceNotFoundException('user', userId);
        }
        return user;
    }

    public async getUserByEmail(email: string): Promise<Optional<UserDto>> {
        const user: Optional<UserDto> = await this.userRepository.findUser({
            email: email,
        });

        return user;
    }

    public async getUserByWithPurchases(
        userId: number
    ): Promise<UserWithPurchasesDto> {
        const user: Optional<UserWithPurchasesDto> =
            await this.userRepository.findUserWithPurchases(userId);

        if (!user) {
            throw new ResourceNotFoundException('user', userId);
        }

        return user;
    }

    public async updateUser(userId: number, dto: UpdateUserDto): Promise<void> {
        this.logger.log(`Updating user id=${userId}`);

        if (Object.keys(dto).length === 0) {
            throw new ValidationException('No updates to implement');
        }

        await this.userRepository.updateUser(userId, dto);
        this.logger.log(`User updated successfully: id=${userId}`);
    }

    public async deleteUser(userId: number): Promise<void> {
        this.logger.warn(`Deleting user id=${userId}`);

        await this.userRepository.destroyUser(userId);
        this.logger.log(`User deleted successfully: id=${userId}`);
    }

    public async updateRefreshToken(
        userId: number,
        refreshToken: Optional<string>
    ): Promise<void> {
        await this.userRepository.updateRefreshToken(userId, refreshToken);
    }
}
