import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';
import { KitService } from './kit.service';
import { CreateKitBodyDTO } from './dtos/create-kit.dto';
import { GetKitsData, GetKitsQuery } from './interfaces/get-kits.interface';

@Controller('kit')
export class KitController {
  constructor(private readonly kitService: KitService) {}

  /**
   * Get all kits
   * [GET] /kits
   */
  @Get()
  @ApiOperation({ summary: 'Get all kits' })
  async getAllKits(
    @Req() req: AuthRequest,
    @Res() res: Response,
    @Query() query: GetKitsQuery,
  ) {
    const data: GetKitsData = { ...query };
    const response = await this.kitService.getAllKits(data, req.user);
    res.status(response.httpStatus).json(response);
  }
}
