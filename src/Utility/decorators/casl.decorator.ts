import { SetMetadata } from '@nestjs/common';
import { Action } from '../../Auth/authorization/casl-ability.factory';

export interface RequiredRule {
    action: Action;
    subject;
}

export const CHECK_ABILITY = 'check_ability';
export const CheckAbilities = (...requirements: RequiredRule[]) =>
    SetMetadata(CHECK_ABILITY, requirements);
