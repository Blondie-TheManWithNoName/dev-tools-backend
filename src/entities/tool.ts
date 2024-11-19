import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  ManyToMany,
} from 'typeorm';
import { IsDefined } from 'class-validator';
import { User } from './user';
import { ToolStateEnum } from 'src/enums/tool-state';
import { Kit } from './kit';
import { ToolInfo } from './tool_info';

@Entity()
export class Tool {
  /** ID */
  @PrimaryGeneratedColumn()
  @IsDefined()
  id: number;

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

  /** Posted By */
  @ManyToOne(() => User, (user) => user.user_id)
  @IsDefined()
  posted_by: User;

  /** Kits */
  @ManyToMany(() => Kit, (kit) => kit.tools)
  kits: Kit[];

  @Column('int', { default: 0 })
  @IsDefined()
  numFavorites: number;

  @OneToMany(() => ToolInfo, (toolInfo) => toolInfo.tool)
  toolInfos: ToolInfo[];
}
