import {
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
} from 'sequelize-typescript';
import { UserEntity } from '../../../Domain/User/repository/user.repository.model';

interface OAuthCreationAttributes {
    userId: number;
    email: string;
    provider: string;
    providerId: string;
}

@Table({ tableName: 'oauthUsers' })
export class OAuthAccountEntity extends Model<
    OAuthAccountEntity,
    OAuthCreationAttributes
> {
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    oauthId: number;

    @ForeignKey(() => UserEntity)
    @Column({ type: DataType.INTEGER, allowNull: false })
    userId: number;

    @Column({ type: DataType.STRING, allowNull: false })
    email: string;

    @Column({ type: DataType.STRING, allowNull: false })
    provider: string;

    @Column({ type: DataType.STRING, allowNull: false })
    providerId: string;

    @BelongsTo(() => UserEntity)
    user: UserEntity;
}
