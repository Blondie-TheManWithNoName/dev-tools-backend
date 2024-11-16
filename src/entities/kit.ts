import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  ManyToMany,
  JoinTable,
  Column,
} from 'typeorm';
import { User } from './user';
import { Tool } from './tool';
import { IsDefined, IsNotEmpty } from 'class-validator';

@Entity()
export class Kit {
  @PrimaryGeneratedColumn()
  @IsDefined()
  id: number;

  @Column()
  @IsDefined()
  @IsNotEmpty()
  title: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => User, (user) => user.kits)
  @IsDefined()
  @IsNotEmpty()
  owner: User;

  @ManyToMany(() => Tool, (tool) => tool.kits, { cascade: true })
  @JoinTable({
    name: 'kit_tools',
    joinColumns: [{ name: 'kitId', referencedColumnName: 'id' }],
    inverseJoinColumns: [{ name: 'toolId', referencedColumnName: 'id' }],
  })
  tools: Tool[];
}
