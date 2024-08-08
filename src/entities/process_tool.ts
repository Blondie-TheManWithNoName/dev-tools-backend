import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
} from 'typeorm';
import { Favorite } from './favorites';
import { Tag } from './tag';
import { IsDefined, IsOptional } from 'class-validator';
import { User } from './user';
import { ToolState } from './tool_state';
import { Tool } from './tool';

@Entity()
export class ProcessTool {
  @PrimaryGeneratedColumn()
  @IsDefined()
  id: number;

  @ManyToOne(() => Tool, (tool) => tool.tool_id)
  @JoinColumn({ name: 'tool_id' })
  tool: Tool;

  @ManyToOne(() => ToolState, (toolState) => toolState.state_id)
  @JoinColumn({ name: 'prev_state' })
  prev_state: ToolState;

  @ManyToOne(() => ToolState, (toolState) => toolState.state_id)
  @JoinColumn({ name: 'state' })
  state: ToolState;

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  message?: string;

  @ManyToOne(() => User, (user) => user.user_id)
  @IsDefined()
  processed_by: User;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  processed_time: Date;
}
