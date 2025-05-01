import { Kit } from 'src/entities/kit';
import { User } from 'src/entities/user';
import { UserPreviewDTO } from 'src/user/dtos/user-preview.dto';

export class KitPreviewDTO {
  id: number;
  title: string;
  owner: UserPreviewDTO;
  description: string;
  toolsFavicons: string[];
  numTools: number;

  constructor(kit: Kit) {
    this.id = kit.id;
    this.title = kit.title;
    this.owner = new UserPreviewDTO(kit.owner);
    this.toolsFavicons = kit.tools.map((tool) => tool.toolInfos[0].url);
    this.numTools = kit.tools.length;
  }
}
