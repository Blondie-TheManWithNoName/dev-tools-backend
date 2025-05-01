import { Tag } from 'src/entities/tag';
import { Tool } from 'src/entities/tool';

export class ToolDTO {
  id: number;
  title: string;
  url: string;
  description: string;
  tags: Tag[];
  numFavorites: number;
  favicon: string;

  constructor(tool: Tool) {
    const validToolInfo = tool.toolInfos[0].valid
      ? tool.toolInfos[0]
      : tool.toolInfos[1];

    this.id = tool.id;
    this.title = validToolInfo.title;
    this.url = validToolInfo.url;
    this.description = validToolInfo.description;
    this.tags = validToolInfo.tags;
    this.numFavorites = tool.numFavorites;
    this.favicon = validToolInfo.faviconPath;
  }
}
