import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserLoginDetail } from './entities/userLogin.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { MailService } from 'src/services/mail.service';
import { Otp } from './entities/otp.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserLoginDetail,Otp])],
  controllers: [UserController],
  providers: [UserService,AuthService,MailService],
  exports:[UserModule,TypeOrmModule.forFeature([Otp])]
})
export class UserModule {}
