import {
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
} from 'sequelize-typescript';
import { UserEntity } from '../../../Domain/User/repository/user.repository.model';
import { RecordEntity } from '../../../Domain/Record/repository/record.repository.model';

interface PurchaseCreationAttributes {
    userId: number;
    recordId: number;
    sessionId: string;
}

@Table({ tableName: 'purchases' })
export class PurchaseEntity extends Model<
    PurchaseEntity,
    PurchaseCreationAttributes
> {
    @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
    purchaseId: number;

    @ForeignKey(() => UserEntity)
    @Column({ type: DataType.INTEGER })
    userId: number;

    @ForeignKey(() => RecordEntity)
    @Column({ type: DataType.INTEGER })
    recordId: number;

    @Column({ type: DataType.STRING })
    sessionId: string;

    @Column({ type: DataType.STRING, defaultValue: 'pending' })
    status: 'pending' | 'paid' | 'failed';

    @BelongsTo(() => UserEntity)
    user: UserEntity;

    @BelongsTo(() => RecordEntity)
    record: RecordEntity;
}
