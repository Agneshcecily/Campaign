import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { jwtConstants } from './constants';
import { AuthGuard } from './auth.guard';

import { UserLoginDetail } from 'src/user/entities/userLogin.entity';
import { MailService } from 'src/services/mail.service';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { Otp } from 'src/user/entities/otp.entity';


@Module({
   imports:[
    TypeOrmModule.forFeature([UserLoginDetail,Otp]),
    UserModule,
    JwtModule.register({
      global:true,
      secret:jwtConstants.secret,
      signOptions:{expiresIn:'60s'}
    }),
    
  
  ],
  controllers: [AuthController],
  providers: [AuthService,UserService,AuthGuard,MailService],
  exports:[AuthService]
})
export class AuthModule {}
