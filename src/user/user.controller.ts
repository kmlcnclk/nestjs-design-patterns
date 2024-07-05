import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import { CreateUserResponse } from './responses/create-user.response';
import { ZodPipe } from 'src/pipes/zod.pipe';
import { createUserSchema } from './zodSchemas/create-user.zod';

@Controller('user')
export class UserController {
  constructor(@Inject('USER_SERVICE') readonly userService: UserService) {}

  @Post()
  async create(
    @Body(new ZodPipe(createUserSchema)) createUserDto: CreateUserDto,
  ): Promise<CreateUserResponse> {
    const user = await this.userService.create(createUserDto);
    return CreateUserResponse.fromUser(user);
  }

  @Get()
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<User> {
    return this.userService.remove(id);
  }
}
