import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { OAuthAccountEntity } from '../../../Domain/OAuthAccount/repository/oauthAccount.repository.model';
import { PurchaseEntity } from '../../../Domain/Purchase/repository/purchase.repository.model';
import { ReviewEntity } from '../../../Domain/Review/repository/review.model';
import type { Optional, Role } from '../../../Utility/global.types';

interface UserCreationAttributes {
    email: string;
    firstName: string;
    lastName: string;
    image?: string;
    isOAuthUser?: boolean;
}

@Table({ tableName: 'users' })
export class UserEntity extends Model<UserEntity, UserCreationAttributes> {
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    userId: number;

    @Column({ type: DataType.STRING, allowNull: false, unique: true })
    email: string;

    @Column({ type: DataType.STRING, allowNull: true })
    password: Optional<string>;

    @Column({
        type: DataType.STRING,
        allowNull: true,
        defaultValue: 'defaultImage.jpg',
    })
    image: string;

    @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
    isOAuthUser: boolean;

    @Column({ type: DataType.STRING, allowNull: true })
    refreshToken: Optional<string>;

    @Column({ type: DataType.STRING, allowNull: false })
    firstName: string;

    @Column({ type: DataType.STRING, allowNull: false })
    lastName: string;

    @Column({ type: DataType.DATE, allowNull: true })
    birthDate: Optional<string>;

    @Column({
        type: DataType.ENUM('admin', 'customer'),
        allowNull: false,
        defaultValue: 'customer',
    })
    role: Role;

    @HasMany(() => ReviewEntity)
    reviews: ReviewEntity[];

    @HasMany(() => PurchaseEntity)
    purchases: PurchaseEntity[];

    @HasMany(() => OAuthAccountEntity)
    oauthAccounts: OAuthAccountEntity[];
}
