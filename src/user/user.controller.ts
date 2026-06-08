import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { UserProfileDto } from './dto/userProfile.dto';
import { UserLoginDto } from './dto/userLogin.dto';
// import { UpdateUserDto } from './dto/userLogin.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  
   @Post('post')
  create(@Body() createLoginDto: UserLoginDto) {
    return this.userService.createLogin(createLoginDto);
  }
  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.userService.create(createUserDto);
  // }

  // @Get()
  // findAll() {
  //   return this.userService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.userService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.userService.remove(+id);
  // }
}
