import { Tag } from '../entities/tag';
import { Tool } from '../entities/tool';
import { ToolInfo } from '../entities/tool_info';
import { ToolState } from '../entities/tool_state';
import { User } from '../entities/user';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class Tools1723395231523 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const dataSource = queryRunner.connection;

    const toolRepository = dataSource.getRepository(Tool);
    const toolInfoRepository = dataSource.getRepository(ToolInfo);
    const tagRepository = dataSource.getRepository(Tag);
    const toolStateRepository = dataSource.getRepository(ToolState);
    const userRepository = dataSource.getRepository(User);

    // Default state and user for the new tools
    const toolState = await toolStateRepository.findOne({
      where: { state: 'approved' },
    });
    const user = await userRepository.findOne({ where: { username: 'admin' } });

    console.log('toolState', toolState);
    console.log('user', user);
    if (!toolState || !user) {
      throw new Error(
        "ToolState 'Active' or User 'admin' not found in the database.",
      );
    }

    // Tool data to be inserted
    const toolsData = [
      {
        name: 'SVGL',
        description:
          'A beautiful library with SVG logos. Built with Sveltekit & Tailwind CSS.',
        url: 'https://svgl.app/',
        tags: ['SVG', 'Logos', 'UI'],
      },
      {
        name: 'Tabler Icons',
        description:
          'Tabler is fully responsive and compatible with all modern browsers...',
        url: 'https://tabler.io/icons',
        tags: ['Logos', 'SVG', 'Illustrations', 'UI'],
      },
      {
        name: 'Open Graph',
        description:
          'The easiest way to preview and generate Open Graph Meta tags...',
        url: 'https://www.opengraph.xyz/',
        tags: ['SEO'],
      },
      {
        name: 'UnDraw',
        description:
          'Create better designed websites, products and applications...',
        url: 'https://undraw.co/',
        tags: ['Illustrations', 'UI'],
      },
      {
        name: 'Shots',
        description:
          'Shots is an innovative tool designed to help designers and developers...',
        url: 'https://shots.so/',
        tags: ['Illustrations', 'UI'],
      },
      {
        name: 'Background Snippets',
        description:
          'Ready-to-use, simply copy and paste into your next project...',
        url: 'https://bg.ibelick.com/',
        tags: ['UI'],
      },
      {
        name: 'Fontsource',
        description:
          'Fontsource is a collection of open-source fonts that are packaged...',
        url: 'https://fontsource.org/',
        tags: ['Fonts', 'UI'],
      },
      {
        name: 'CSS Matic Box Shadow',
        description: 'Blur radius changes, color changes, shadow size...',
        url: 'https://www.cssmatic.com/box-shadow',
        tags: ['CSS', 'UI'],
      },
    ];

    // Insert tools and their tags
    for (const toolData of toolsData) {
      const tool = new Tool();
      tool.state = toolState;
      tool.posted_by = user;
      await toolRepository.save(tool);

      const toolInfo = new ToolInfo();
      toolInfo.tool = tool;
      toolInfo.title = toolData.name;
      toolInfo.description = toolData.description;
      toolInfo.url = toolData.url;
      toolInfo.valid = true;

      const tags = [];
      for (const tagName of toolData.tags) {
        let tag = await tagRepository.findOne({ where: { name: tagName } });
        if (!tag) {
          tag = new Tag();
          tag.name = tagName;
          await tagRepository.save(tag);
        }
        tags.push(tag);
      }

      toolInfo.tags = tags;
      await toolInfoRepository.save(toolInfo);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Logic for reverting the migration (deleting the tools)
    const dataSource = queryRunner.connection;
    const toolInfoRepository = dataSource.getRepository(ToolInfo);

    const toolsToDelete = [
      'SVGL',
      'Tabler Icons',
      'Open Graph',
      'UnDraw',
      'Shots',
      'Background Snippets',
      'Fontsource',
      'CSS Matic Box Shadow',
    ];

    for (const toolName of toolsToDelete) {
      const toolInfo = await toolInfoRepository.findOne({
        where: { title: toolName },
      });
      if (toolInfo) {
        await toolInfoRepository.remove(toolInfo);
      }
    }
  }
}
