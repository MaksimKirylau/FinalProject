import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { PurchaseEntity } from '../../../Domain/Purchase/repository/purchase.repository.model';
import { ReviewEntity } from '../../../Domain/Review/repository/review.model';
import type { Optional } from '../../../Utility/global.types';

interface RecordCreationAttributes {
    discogsId?: number;
    name: string;
    authorName: string;
    description: string;
    price: number;
}

@Table({ tableName: 'records' })
export class RecordEntity extends Model<
    RecordEntity,
    RecordCreationAttributes
> {
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    recordId: number;

    @Column({
        type: DataType.INTEGER,
        unique: true,
        allowNull: true,
        defaultValue: null,
    })
    discogsId: Optional<number>;

    @Column({ type: DataType.STRING, allowNull: false })
    name: string;

    @Column({ type: DataType.STRING, allowNull: false })
    authorName: string;

    @Column({ type: DataType.STRING, allowNull: false })
    description: string;

    @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
    price: number;

    @HasMany(() => ReviewEntity)
    reviews: ReviewEntity[];

    @HasMany(() => PurchaseEntity)
    purchases: PurchaseEntity[];
}
