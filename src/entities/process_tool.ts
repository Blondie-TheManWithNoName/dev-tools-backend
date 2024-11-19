import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { IsDefined, IsOptional } from 'class-validator';
import { User } from './user';
import { Tool } from './tool';
import { ToolStateEnum } from 'src/enums/tool-state';

@Entity()
export class ProcessTool {
  /** ID */
  @PrimaryGeneratedColumn()
  @IsDefined()
  id: number;

  /** Tool State */
  @ManyToOne(() => Tool, (tool) => tool.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tool_id' })
  tool: Tool;

  /** Previous State */
  @Column('tinyint', {
    width: 1,
    nullable: false,
    default: 1,
    name: 'prev_state',
    transformer: {
      to: (value: string) =>
        value ? Object.keys(ToolStateEnum).indexOf(value) + 1 : 1,
      from: (value: number) => Object.values(ToolStateEnum)[value - 1],
    },
  })
  prev_state: keyof typeof ToolStateEnum;

  /** State */
  @Column('tinyint', {
    width: 1,
    nullable: false,
    default: 1,
    name: 'state',
    transformer: {
      to: (value: string) =>
        value ? Object.keys(ToolStateEnum).indexOf(value) + 1 : 1,
      from: (value: number) => Object.values(ToolStateEnum)[value - 1],
    },
  })
  state: keyof typeof ToolStateEnum;

  /** Message */
  @Column({ type: 'text', nullable: true })
  @IsOptional()
  message?: string;

  /** Processed By */
  @ManyToOne(() => User, (user) => user.user_id)
  @IsDefined()
  processed_by: User;

  /** Processed Time */
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  processed_time: Date;
}
