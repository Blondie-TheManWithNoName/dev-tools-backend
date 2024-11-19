import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ProcessService } from './process.service';
import { UserGuard } from 'src/guards/user.guard';
import { Response } from 'express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthRequest } from 'src/app.interfaces';

@ApiTags('Process Tools')
@Controller('process')
export class ProcessController {
  constructor(private readonly favsService: ProcessService) {}

  /**
   * Get processes
   * [GET] /process
   */
  @Get()
  @ApiOperation({ summary: 'Gets tool processes' })
  @UseGuards(UserGuard)
  async getProcesses(@Req() req: AuthRequest, @Res() res: Response) {
    const response = await this.favsService.getProcesses();
    res.status(response.httpStatus).json(response);
  }
}
