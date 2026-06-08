import { Column, Entity,JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserLoginDetail } from "./userLogin.entity";
import { BaseEntity } from "src/utils/entitites/base.entity";

@Entity('user_type_master')
export class UserTypeMaster extends BaseEntity{

    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    name:string;

}

@Entity('country_master')
export class CountryMaster extends BaseEntity{

    @PrimaryGeneratedColumn()
    id:string;

    @Column()
    name:string;

}
@Entity('state_master')
export class StateMaster extends BaseEntity{

    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    name:string;

    @ManyToOne(()=>CountryMaster,country=>country.id)
    @JoinColumn({name:'countryId'})
    country:CountryMaster;

}

@Entity('district_master')
export class DistrictMaster extends BaseEntity{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    name:string;

    @ManyToOne(()=>StateMaster,state=>state.id)
    @JoinColumn({name:'stateId'})
    state:StateMaster;
}

@Entity('user_profile_detail')
export class UserProfileDetail extends BaseEntity{

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    firstName:string;

    @Column()
    lastName:string;

    @Column()
    mobileNumber:number;

    @Column()
    address:string;

    @Column('json')
    otherInfo:any;

    @ManyToOne(()=>UserTypeMaster,userType=>userType.id)
    @JoinColumn({name:'userTypeId'})
    userType:UserTypeMaster;

    @ManyToOne(()=>CountryMaster,country=>country.id)
    @JoinColumn({name:'countryId'})
    country:CountryMaster;

    @ManyToOne(()=>StateMaster,state=>state.id)
    @JoinColumn({name:'stateId'})
    state:StateMaster;

    @ManyToOne(()=>DistrictMaster,district=>district.id)
    @JoinColumn({name:'districtId'})
    district:DistrictMaster;

    @ManyToOne(()=>UserLoginDetail,login=>login.id)
    @JoinColumn({name:'userId'})
    login:UserLoginDetail;



}







