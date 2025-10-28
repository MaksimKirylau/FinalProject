import { CreateOAuthUserDto } from '../../../Auth/authentification/oauth/oauth.dto';
import {
    CreateUserDto,
    UpdateUserDto,
    UserPresentationDto,
    UserWithPurchsesPresentationDto,
} from '../../../API/User/user.api.dto';
import { UserDto, UserWithPurchasesDto } from '../../../Domain/User/user.dto';
import { UserEntity } from '../../../Domain/User/repository/user.repository.model';
import { RequestUserDto } from '../../../Auth/authentification/auth.dto';

export const MOCK_USER_ID: number = 1;
export const MOCK_NONEXISTENT_USER_ID: number = 999;
export const MOCK_USER_EMAIL: string = 'mail@mail.ru';
export const MOCK_NONEXISTENT_USER_EMAIL: string = 'nonexistent@mail.ru';
export const MOCK_NEW_REFRESH_TOKEN: string = 'newRefreshToken';

export const mockImage = { buffer: Buffer.from('test') };
export const mockFileName = 'test.jpg';

export const mockCreateUser: CreateUserDto = {
    email: 'mail@mail.ru',
    password: 'plainPassword',
    firstName: 'Ivan',
    lastName: 'Ivanov',
    birthDate: '11.11.11',
};

export const mockCreateOauthUser: CreateOAuthUserDto = {
    email: 'mail@gmail.com',
    firstName: 'Vasya',
    lastName: 'Pupkin',
    providerId: '123',
};

export const mockRequestUser: RequestUserDto = {
    userId: 1,
    email: 'mail@mail.ru',
    role: 'customer',
};

export const mockUpdateUser: UpdateUserDto = {
    firstName: 'Updated first name',
};

export const mockUserPresentation: UserPresentationDto = {
    userId: 1,
    role: 'customer',
    firstName: 'Ivan',
    lastName: 'Ivanov',
    birthDate: '11.11.11',
    email: 'mail@mail.ru',
    image: mockFileName,
    createdAt: '15.15.15',
};

export const mockUserWithPurchasesPresentation: UserWithPurchsesPresentationDto =
    {
        userId: 1,
        role: 'customer',
        firstName: 'Ivan',
        lastName: 'Ivanov',
        birthDate: '11.11.11',
        email: 'mail@mail.ru',
        image: mockFileName,
        createdAt: '15.15.15',
        purcases: ['Record 1', 'Record 2'],
    };

export const mockUserEntity: UserEntity = {
    dataValues: {
        userId: 1,
        role: 'customer',
        isOAuthUser: false,
        firstName: 'Ivan',
        lastName: 'Ivanov',
        birthDate: '11.11.11',
        email: 'mail@mail.ru',
        password: 'hashedPassword',
        image: mockFileName,
        refreshToken: 'refreshToken',
        createdAt: '15.15.15',
        updatedAt: '16.16.16',
    },
} as UserEntity;

export const mockOAuthUserEntity: UserEntity = {
    dataValues: {
        userId: 2,
        role: 'customer',
        isOAuthUser: true,
        firstName: 'Vasya',
        lastName: 'Pupkin',
        birthDate: null,
        email: 'mail@gmail.com',
        password: null,
        image: mockFileName,
        refreshToken: 'refreshToken',
        createdAt: '15.15.15',
        updatedAt: '16.16.16',
    },
} as UserEntity;

export const mockUserWithPurchasesEntity: UserEntity = {
    dataValues: {
        userId: 1,
        role: 'customer',
        isOAuthUser: false,
        firstName: 'Ivan',
        lastName: 'Ivanov',
        birthDate: '11.11.11',
        email: 'mail@mail.ru',
        password: 'hashedPassword',
        image: mockFileName,
        refreshToken: 'refreshToken',
        createdAt: '15.15.15',
        updatedAt: '16.16.16',
        purchases: [
            {
                dataValues: {
                    record: {
                        name: 'Record 1',
                    },
                },
            },
            {
                dataValues: {
                    record: {
                        name: 'Record 2',
                    },
                },
            },
        ],
    },
} as UserEntity;

export const mockUser: UserDto = {
    userId: 1,
    role: 'customer',
    isOAuthUser: false,
    firstName: 'Ivan',
    lastName: 'Ivanov',
    birthDate: '11.11.11',
    email: 'mail@mail.ru',
    password: 'hashedPassword',
    image: mockFileName,
    refreshToken: 'refreshToken',
    createdAt: '15.15.15',
    updatedAt: '16.16.16',
};

export const mockOauthUser: UserDto = {
    userId: 2,
    role: 'customer',
    isOAuthUser: true,
    firstName: 'Vasya',
    lastName: 'Pupkin',
    birthDate: null,
    email: 'mail@gmail.com',
    password: null,
    image: mockFileName,
    refreshToken: 'refreshToken',
    createdAt: '15.15.15',
    updatedAt: '16.16.16',
};

export const mockUserWithPurchases: UserWithPurchasesDto = {
    userId: 1,
    role: 'customer',
    isOAuthUser: false,
    firstName: 'Ivan',
    lastName: 'Ivanov',
    birthDate: '11.11.11',
    email: 'mail@mail.ru',
    password: 'hashedPassword',
    image: mockFileName,
    refreshToken: 'refreshToken',
    createdAt: '15.15.15',
    updatedAt: '16.16.16',
    purchases: ['Record 1', 'Record 2'],
};
