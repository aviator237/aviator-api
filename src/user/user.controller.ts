import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { User } from 'src/decorators/users.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entites/user.entity';
import { UserService } from './user.service';
import { UserRoleEnum } from 'src/enum/user-role.enum';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/token-auth/Guard/roles.guard';
import { IsValidObjectIdPipe } from 'src/pipes/is-valid-object-id.pipe';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
    ) { }

    @Roles(UserRoleEnum.USER, UserRoleEnum.SUPER_ADMIN)
    @UseGuards(RolesGuard)
    @Get("getWalletAmount")
    async getWalletAmount(
        @User() user: UserEntity
    ) {
        return await this.userService.getWalletAmount(user)
    }

    @Delete()
    async userAccountSoftDelete(
        @User() user: UserEntity
    ) {
        return await this.userService.userSoftDeleteAccount(user.id);
    }

    @Roles(UserRoleEnum.SUPER_ADMIN)
    @Delete(":id")
    async deleteUser(
        @Param("id", new IsValidObjectIdPipe(UserEntity)) id: string
    ) {
        return await this.userService.userSoftDeleteAccount(id);
    }

    @Get("getData")
    async getOneUserData(
        @User() user: UserEntity
    ) {
        return await this.userService.getById(user.id, user)
    }

    @Roles(UserRoleEnum.USER, UserRoleEnum.SUPER_ADMIN)
    @UseGuards(RolesGuard)
    @Get("getGodDaughters")
    async getUserGodDaughters(
        @User() user: UserEntity,
        @Query("page", ParseIntPipe, new DefaultValuePipe(0)) page: number,
        @Query("count", ParseIntPipe, new DefaultValuePipe(0)) count: number
    ) {
        return await this.userService.getUserGodDaughters(user, page, count);
    }



    @Roles(UserRoleEnum.SUPER_ADMIN)
    @UseGuards(RolesGuard)
    @Get(":id")
    async getById(
        @User() user: UserEntity,
        @Param("id", new IsValidObjectIdPipe(UserEntity)) id: string
    ) {
        return await this.userService.getById(id, user)
    }

    @Roles(UserRoleEnum.SUPER_ADMIN)
    @UseGuards(RolesGuard)
    @Get()
    async getUsers(
        @User() user: UserEntity,
        @Query("page", new DefaultValuePipe(0)) page: number,
        @Query("count", new DefaultValuePipe(0)) count: number
    ) {
        return await this.userService.getUsers(user, page, count)
    }

    @Roles(UserRoleEnum.SUPER_ADMIN)
    @Patch(":id")
    async userUpdateAccountControl(
        @Body() UpdateUserDto: UpdateUserDto,
        @Param("id", new IsValidObjectIdPipe(UserEntity)) id: string,
    ) {
        return await this.userService.update(id, UpdateUserDto)
    }

    @Patch()
    async updateMyAcount(
        @Body() UpdateUserDto: UpdateUserDto,
        @User() user: UserEntity,
    ) {
        return await this.userService.update(user.id, UpdateUserDto)
    }

    @Roles(UserRoleEnum.USER, UserRoleEnum.SUPER_ADMIN)
    @UseGuards(RolesGuard)
    @Post("change-password")
    async changePassword(
        @User() user: UserEntity,
        @Body() changePasswordDto: ChangePasswordDto
    ) {
        return await this.userService.changePassword(user, changePasswordDto);
    }

}
