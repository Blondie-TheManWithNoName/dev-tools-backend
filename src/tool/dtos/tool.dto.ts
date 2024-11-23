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

  constructor(tool: Tool, favicon: string) {
    this.id = tool.id;
    this.title = tool.toolInfos[0].title;
    this.url = tool.toolInfos[0].url;
    this.description = tool.toolInfos[0].description;
    this.tags = tool.toolInfos[0].tags;
    this.numFavorites = tool.numFavorites;
    this.favicon = favicon;
  }
}
