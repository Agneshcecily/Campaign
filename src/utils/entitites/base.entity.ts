import { Column, CreateDateColumn, Entity } from "typeorm";

@Entity()
export class BaseEntity {
  @CreateDateColumn({nullable:true})
  createdAt: Date;

  @Column({nullable:true})
  updatedAt: Date;
  
  @Column({nullable:true})
  deletedAt: Date;

  @Column({nullable:true})
  createdBy: string;

  @Column({nullable:true})
  updatedBy: string;

  @Column({nullable:true})
  deletedBy: string;

}