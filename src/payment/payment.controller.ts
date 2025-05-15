import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query, ParseIntPipe, Headers, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { User } from 'src/decorators/users.decorator';
import { UserEntity } from 'src/user/entites/user.entity';
import { SkipAuth } from 'src/decorators/skip-auth.decorator';
import { NotchPayGuard } from 'src/token-auth/Guard/notchpay.guard';
import { UserRoleEnum } from 'src/enum/user-role.enum';
import { RolesGuard } from 'src/token-auth/Guard/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { CreateTransfertDto } from './dto/create-transfert.dto';
import { IsValidObjectIdPipe } from 'src/pipes/is-valid-object-id.pipe';
import { PaymentEntity } from './entities/payment.entity';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) { }

  @Roles(UserRoleEnum.USER, UserRoleEnum.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @Post()
  async create(
    @Body() createPaymentDto: CreatePaymentDto,
    @User() user: UserEntity
  ) {
    return await this.paymentService.createPayment(createPaymentDto, user);
  }

  @Roles(UserRoleEnum.USER, UserRoleEnum.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @Post("transfer")
  async transfer(
    @Body() createTransfertDto: CreateTransfertDto,
    @User() user: UserEntity
  ) {
    return await this.paymentService.createTransfer(createTransfertDto, user);
  }

  @Post("handledWebhook")
  @SkipAuth()
  @UseGuards(NotchPayGuard)
  async handledWebhook(
    @Body("event") event: string,
    @Body("data") data,
  ) {
    return await this.paymentService.handledWebhook(event, data);
  }

  @Roles(UserRoleEnum.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @Get()
  async findAll(
    @Query("page", ParseIntPipe) page: number,
    @Query("count", ParseIntPipe) count: number
  ) {
    return await this.paymentService.findAll(page, count);
  }

  @Roles(UserRoleEnum.USER, UserRoleEnum.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @Get("byUser")
  async getUserPayment(
    @Query("page", ParseIntPipe) page: number,
    @Query("count", ParseIntPipe) count: number,
    @User() user: UserEntity
  ) {
    return await this.paymentService.getUserPayment(user, page, count);
  }

  @Roles(UserRoleEnum.USER, UserRoleEnum.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @Get("getReservationAmount")
  getReservationAmount() {
    return this.paymentService.getReservationAmount();
  }

  @Roles(UserRoleEnum.USER, UserRoleEnum.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @Get(':id')
  async findOne(
    @Param('id', new IsValidObjectIdPipe(PaymentEntity)) id: number
  ) {
    return await this.paymentService.findOne(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
  //   return this.paymentService.update(+id, updatePaymentDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.paymentService.remove(+id);
  // }
}
