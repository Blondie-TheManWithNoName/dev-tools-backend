import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Kit } from './kit';
import { ToolInfo } from './tool_info';
import { ToolStateEnum } from 'src/enums/tool-state';
import { User } from './user';
import { UserTypeEnum } from 'src/enums/user-type';

@Entity()
export class Tool {
  /** ID */
  @PrimaryGeneratedColumn()
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
  posted_by: User;

  /** Kits */
  @ManyToMany(() => Kit, (kit) => kit.tools, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  kits: Kit[];

  @Column('int', { default: 0 })
  numFavorites: number;

  @OneToMany(() => ToolInfo, (toolInfo) => toolInfo.tool)
  toolInfos: ToolInfo[];

  constructor(data?: { user: User }) {
    if (data) {
      const { user } = data;
      // this.id = uuid() TO DO
      this.posted_by = user;
      this.state= user.type === UserTypeEnum.ADMIN
        ? ToolStateEnum.APPROVED // Inmediately approve when ADMIN creates it
        : ToolStateEnum.PENDING,
    }
  }
}
