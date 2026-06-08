import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { MailService } from 'src/services/mail.service';
import { Otp } from 'src/user/entities/otp.entity';
import { UserLoginDetail } from 'src/user/entities/userLogin.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private jwtService: JwtService,
    private readonly mailservice: MailService,
    @InjectRepository(Otp)
    private OtpRepository: Repository<Otp>,
    @InjectRepository(UserLoginDetail)
    private userRepository: Repository<UserLoginDetail>,
  ) {}

  async signIn(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findUser(email);
    if (!user) {
      throw new UnauthorizedException();
    }

    const passfield = await bcrypt.compare(pass, user.password);
    if (!passfield) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, userEmail: user.emailId };
    return {
      token: await this.jwtService.signAsync(payload),
    };
  }

  async sendOtpToUser(email: string, otp: number) {
    const user = await this.findUserByMail(email);
    const otpRepo = this.OtpRepository.create({ otp });
    const otpTable = await this.OtpRepository.save(otpRepo);
    user.otpId = otpTable;
    const updatedUser = await this.userRepository.save(user);
    await this.mailservice.sendOtp(email, otp);
    return {
      sendOtp:"successfull"
    }
  }

  async findUserByMail(email: string) {
    const user = await this.userRepository.findOne({
      where: { emailId: email },
      relations: ['otpId'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async verifyOtp(otp: number, email: string) {
    const user = await this.userRepository.findOne({
      where: { emailId: email },
      select: ['otpId'],
    });
    const otpId = user?.otpId?.id;
    if (!otpId) {
      throw new NotFoundException('OTP record not found for user');
    }

    const otpRecord = await this.OtpRepository.findOne({
      where: { id: otpId },
    });

    if (otpRecord?.otp === Number(otp)) {
      console.log('verified');
      return true;
    }
    else{
    console.log('OTP did not match');
    return false;
    }
  }

async changePassword(email:string,newPassword:string){
if (!email) {
    throw new UnauthorizedException('Session expired or email not found');
  }

  // 1. Find the user by session-stored email
  const user = await this.userRepository.findOne({ where: { emailId: email } });

  if (!user) {
    throw new NotFoundException('User not found');
  }

  // 2. Hash the new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // 3. Update the user record
  user.password = hashedPassword;
  await this.userRepository.save(user);

  return true;
}

}
