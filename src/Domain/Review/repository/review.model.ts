import {
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
} from 'sequelize-typescript';
import { RecordEntity } from '../../../Domain/Record/repository/record.repository.model';
import { UserEntity } from '../../../Domain/User/repository/user.repository.model';

interface ReviewCreationAttributes {
    userId: number;
    recordId: number;
    comment: string;
    score: number;
}

@Table({ tableName: 'reviews' })
export class ReviewEntity extends Model<
    ReviewEntity,
    ReviewCreationAttributes
> {
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    reviewId: number;

    @ForeignKey(() => UserEntity)
    @Column({ type: DataType.INTEGER, allowNull: false })
    userId: number;

    @ForeignKey(() => RecordEntity)
    @Column({ type: DataType.INTEGER, allowNull: false })
    recordId: number;

    @Column({ type: DataType.STRING, allowNull: false })
    comment: string;

    @Column({ type: DataType.INTEGER, allowNull: false })
    score: number;

    @BelongsTo(() => UserEntity)
    user: UserEntity;

    @BelongsTo(() => RecordEntity)
    record: RecordEntity;
}
