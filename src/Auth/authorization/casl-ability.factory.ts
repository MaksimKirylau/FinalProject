import { Injectable } from '@nestjs/common';
import {
    AbilityBuilder,
    createMongoAbility,
    ExtractSubjectType,
    InferSubjects,
    MongoAbility,
} from '@casl/ability';
import { UserDto } from '../../Domain/User/user.dto';
import { RecordDto } from '../../Domain/Record/record.dto';
import { ReviewDto } from '../../Domain/Review/review.dto';

export enum Action {
    Manage = 'manage',
    Create = 'create',
    Read = 'read',
    Update = 'update',
    Delete = 'delete',
}

type Subjects =
    | InferSubjects<typeof UserDto | typeof RecordDto | typeof ReviewDto>
    | 'all';
export type AppAbility = MongoAbility<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
    createForUser(user: UserDto) {
        const { can, cannot, build } = new AbilityBuilder<AppAbility>(
            createMongoAbility
        );

        if (user.role === 'admin') {
            can(Action.Manage, 'all');
        } else {
            can(Action.Read, UserDto, { userId: user.userId });
            can(Action.Update, UserDto, { userId: user.userId });
            can(Action.Delete, UserDto, { userId: user.userId });

            can(Action.Read, RecordDto);
            cannot(Action.Create, RecordDto);
            cannot(Action.Update, RecordDto);
            cannot(Action.Delete, RecordDto);

            can(Action.Read, ReviewDto);
            can(Action.Create, ReviewDto);
            cannot(Action.Delete, ReviewDto);
        }

        return build({
            detectSubjectType: (item) =>
                item.constructor as ExtractSubjectType<Subjects>,
        });
    }
}
