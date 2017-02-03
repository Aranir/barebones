import {Column, OneToMany, PrimaryColumn, Table, Entity} from "typeorm";
import {Post} from "./Post";



@Entity()
export class Author {

  @PrimaryColumn("int", { generated: true })
  id: number;


  @OneToMany(type => Post, post => post.author, {cascadeInsert: true, cascadeUpdate: true})
  posts: Post[] = [];

  @Column("string")
  firstName: string;

  @Column("string")
  lastName: string;



}
