import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CaslAbilityFactory } from '../casl-ability.factory';
import { ForbiddenError } from '@casl/ability';
import {
    CHECK_ABILITY,
    RequiredRule,
} from '../../../Utility/decorators/casl.decorator';

@Injectable()
export class PoliciesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private caslAbilityFactory: CaslAbilityFactory
    ) {}

    canActivate(context: ExecutionContext): boolean {
        const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) {
            return true;
        }

        const rules =
            this.reflector.get<RequiredRule[]>(
                CHECK_ABILITY,
                context.getHandler()
            ) || [];

        const { user } = context.switchToHttp().getRequest();
        const ability = this.caslAbilityFactory.createForUser(user);

        for (const rule of rules) {
            try {
                ForbiddenError.from(ability).throwUnlessCan(
                    rule.action,
                    rule.subject
                );
            } catch (error) {
                if (error instanceof ForbiddenError) {
                    throw new ForbiddenException(
                        'Access denied by CASL policy'
                    );
                }
                throw error;
            }
        }

        return true;
    }
}
