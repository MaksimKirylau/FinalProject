import { Optional } from '../../Utility/global.types';

export class UserDto {
    userId: number;
    role: 'admin' | 'customer';
    isOAuthUser: boolean;
    firstName: string;
    lastName: string;
    birthDate: Optional<string>;
    email: string;
    password: Optional<string>;
    image: string;
    refreshToken: Optional<string>;
    createdAt: string;
    updatedAt: string;
}

export class UserWithPurchasesDto {
    userId: number;
    role: 'admin' | 'customer';
    isOAuthUser: boolean;
    firstName: string;
    lastName: string;
    birthDate: Optional<string>;
    email: string;
    password: Optional<string>;
    image: string;
    refreshToken: Optional<string>;
    createdAt: string;
    updatedAt: string;
    purchases: Optional<string>[];
}
