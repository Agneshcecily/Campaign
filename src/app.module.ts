import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SubscriberModule } from './subscriber/subscriber.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SourceMaster, Subscriber } from './subscriber/entities/subscriber.entity';
import { SubscriberAttribute } from './subscriber/entities/subscriberAttribute.entity';
import { MappingEntity, SubscriberGroup } from './subscriber/entities/subscriberGroup.entity';
import { UserModule } from './user/user.module';
import { UserLoginDetail } from './user/entities/userLogin.entity';
import { CountryMaster, DistrictMaster, StateMaster, UserProfileDetail, UserTypeMaster } from './user/entities/userProfile.entity';

import { CampaignDetails } from './campaign-details/entities/campaign-detail.entity';
import { ObjectiveMaster } from './campaign-details/entities/objective-master.entity';
import { Rules } from './campaign-details/entities/rules.entity';
import { Schedule } from './campaign-details/entities/schedule.entity';
import { TemplateMaster } from './campaign-details/entities/templateMaster.entity';
import { TimeZoneMaster } from './campaign-details/entities/timeZone-master.entity';
import { ConfigModule } from '@nestjs/config';
import { CampaignDetailsModule } from './campaign-details/campaign-details.module';
import { Otp } from './user/entities/otp.entity';
import { MailModule } from './modules/email.module';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [
    ConfigModule.forRoot({
    isGlobal: true, 
    }),
    TypeOrmModule.forRoot({
    type:'postgres',
    host:process.env.DB_HOST,
    port:process.env.DB_PORT? parseInt(process.env.DB_PORT,10):undefined,
    username:process.env.DB_USERNAME,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_DATABASE,
    entities:[
      UserLoginDetail,
      UserProfileDetail,
      UserTypeMaster,
      DistrictMaster,
      StateMaster,
      CountryMaster,
      Otp,
      Subscriber, 
      SourceMaster, 
      SubscriberAttribute, 
      SubscriberGroup, 
      MappingEntity,
      CampaignDetails,
      ObjectiveMaster,
      Rules,
      Schedule,
      TemplateMaster,
      TimeZoneMaster,
     ],
    synchronize:true,
    }),
    TypeOrmModule.forFeature([
          Subscriber,  
          SubscriberAttribute, 
          SubscriberGroup, 
          MappingEntity,
          SourceMaster,
          CampaignDetails,
          ObjectiveMaster,
          Rules,
          Schedule,
          TemplateMaster,
          TimeZoneMaster,
          Otp
          
      ]),
      UserModule,SubscriberModule,CampaignDetailsModule,MailModule,AuthModule
  ],

  controllers: [AppController],
  providers: [AppService],
})
  
export class AppModule {}
