import { BadRequestException, Body, Controller, forwardRef, Get, HttpCode, HttpStatus, Inject, Post,Request, Res, Session, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private readonly authservice: AuthService) {}

    @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(@Body() signDto:Record<string,any>)
    {
        const token=this.authservice.signIn(signDto.email,signDto.password);
        return token
    }

    @UseGuards(AuthGuard)
    @Get('get')
    getProfile(@Request() req){
        return req.user;
    }

    @Post('sendotp')
  async sendOtp(@Body() body: any,@Session() session: Record<string, any>) {
    if (!body?.email) throw new BadRequestException('Email is required');
    const {email}=body;
    session.email=email;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otp1=otp.replace(/,/g, '');
    const sendOtp=this.authservice.sendOtpToUser(email,parseInt(otp1));
    return sendOtp
  }

  @Post('verifyotp')
  async verifyOtp(@Body() body:any,@Session()  session: Record<string, any>){
        const {otp}=body;
        const email=session.email;
        const isValid=await this.authservice.verifyOtp(otp,email) ;
        if (!isValid) {
           throw new UnauthorizedException('Invalid OTP');
            }
          return { message: 'OTP verified successfully' };
         }


  @Post('changepassword')
  async changePassword(@Body() body:any,@Session() session: Record<string,any>,@Res() res: Response,){
  const { newPassword } = body;
  const email = session.email;
  const updated=await this.authservice.changePassword(email,newPassword);

   if (!updated) {
    return res.status(400).json({ message: 'Password update failed. User not found.' });
  }
  session.destroy((err) => {
    if (err) {
      console.log('Session destroy error:', err);
    }
  });

  return res.status(200).json({ message: 'Password updated successfully' });

  

  }
  @Post('resendotp')
  async resendOtp(@Body() body:any,@Session() session: Record<string,any>,@Res() res: Response){
    const email=session.email;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otp1=otp.replace(/,/g, '');
     const sendOtp=this.authservice.sendOtpToUser(email,parseInt(otp1));
     return sendOtp;

  }

}

