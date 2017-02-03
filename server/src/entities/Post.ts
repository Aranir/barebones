import {Column, OneToMany, PrimaryColumn, ManyToOne, Entity} from "typeorm";
import {Author} from "./Author";



@Entity()
export class Post {

  @PrimaryColumn("int", { generated: true })
  id: number;

  @Column("string")
  title: string;

  @Column("text")
  text: string;

  @Column("string")
  tags: string;

  @ManyToOne(type => Author, author => author.posts, {cascadeAll: true})
  author: Author



}
