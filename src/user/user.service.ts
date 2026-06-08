import { Injectable } from '@nestjs/common';
import { UserLoginDto } from './dto/userLogin.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserLoginDetail } from './entities/userLogin.entity';
import { Repository } from 'typeorm';
import { Otp } from './entities/otp.entity';
import * as bcrypt from 'bcrypt';
// import { UpdateUserDto } from './dto/userLogin.dto';

@Injectable()
export class UserService {
 constructor(@InjectRepository(UserLoginDetail) private userRepository:Repository<UserLoginDetail>,
             @InjectRepository(Otp) private OtpRepository:Repository<Otp>,             
){}

 async createLogin(createLoginDto: UserLoginDto) {
    const saltOrRounds=12;
      const hashedPassword=await bcrypt.hash(createLoginDto.password,saltOrRounds);
      const newUser=this.userRepository.create({
        ...createLoginDto,
        password:hashedPassword
      });
    
  
    return this.userRepository.save(newUser);
  }
  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UserLoginDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
    async findUser(emailId){
    return await this.userRepository.findOne({where:{emailId}});
  }

  async findAl(){
    return await this.userRepository.find();
  }
}
