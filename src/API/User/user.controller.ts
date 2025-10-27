import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Inject,
    Put,
    UseGuards,
} from '@nestjs/common';
import type { IUserApiMapper, IUserController } from './user.api.interfaces';
import { USER_API_MAPPER } from './user.api.constants';
import {
    UpdateUserDto,
    UserPresentationDto,
    UserWithPurchsesPresentationDto,
} from './user.api.dto';
import { USER_SERVICE } from '../../Domain/User/user.constants';
import type { IUserService } from '../../Domain/User/user.interfaces';
import { UserDto, UserWithPurchasesDto } from '../../Domain/User/user.dto';
import { RequestUser } from '../../Utility/decorators/user.decorator';
import { RequestUserDto } from '../../Auth/authentification/auth.dto';
import { PoliciesGuard } from '../../Auth/authorization/guards/casl.guard';
import { CheckAbilities } from '../../Utility/decorators/casl.decorator';
import { Action } from '../../Auth/authorization/casl-ability.factory';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('user')
@UseGuards(PoliciesGuard)
export class UserController implements IUserController {
    constructor(
        @Inject(USER_SERVICE) private readonly usersService: IUserService,
        @Inject(USER_API_MAPPER) private readonly userApiMapper: IUserApiMapper
    ) {}

    @ApiOperation({ summary: 'Retrieves info about current user' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Returns user info',
        type: UserPresentationDto,
    })
    @Get('/me/')
    @CheckAbilities({ action: Action.Read, subject: UserDto })
    public async getUser(
        @RequestUser() requestUser: RequestUserDto
    ): Promise<UserPresentationDto> {
        const user: UserDto = await this.usersService.getUserById(
            requestUser.userId
        );
        const userPresentation: UserPresentationDto =
            this.userApiMapper.userToPresentation(user);
        return userPresentation;
    }

    @ApiOperation({
        summary: 'Retrieves info about current user and his purchases',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Returns user info info and his purchases',
        type: UserWithPurchsesPresentationDto,
    })
    @Get('/info/')
    @CheckAbilities({ action: Action.Read, subject: UserDto })
    public async getUserWithPurchases(
        @RequestUser() requestUser: RequestUserDto
    ): Promise<UserWithPurchsesPresentationDto> {
        const user: UserWithPurchasesDto =
            await this.usersService.getUserByWithPurchases(requestUser.userId);
        const userPresentation: UserWithPurchsesPresentationDto =
            this.userApiMapper.userWithPurchasesToPresentation(user);
        return userPresentation;
    }

    @ApiOperation({ summary: 'Updates user data' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Returns 200 code upon successful update',
    })
    @Put('/update/')
    @CheckAbilities({ action: Action.Update, subject: UserDto })
    public async updateUser(
        @RequestUser() requestUser: RequestUserDto,
        @Body() dto: UpdateUserDto
    ): Promise<void> {
        await this.usersService.updateUser(requestUser.userId, dto);
    }

    @ApiOperation({ summary: 'Deletes user. For admin only' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Returns 200 code upon successful delete',
    })
    @Delete('/delete/')
    @CheckAbilities({ action: Action.Delete, subject: UserDto })
    public async deleteUser(
        @RequestUser() requestUser: RequestUserDto
    ): Promise<void> {
        await this.usersService.deleteUser(requestUser.userId);
    }
}
