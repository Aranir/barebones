import {Column, OneToMany, PrimaryColumn, Table, Entity} from "typeorm";
import {Post} from "./Post";



@Entity()
export class Author {

  @PrimaryColumn("int", { generated: true })
  id: number;

  @Column("string")
  username: string;

  @Column("string")
  email: string;

  @Column("string")
  firstName: string;

  @Column("string")
  lastName: string;



}
