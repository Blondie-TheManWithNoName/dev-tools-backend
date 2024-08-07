import {
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { UserGuard } from 'src/guards/user.guard';
import { Response } from 'express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthRequest } from 'src/app.interfaces';

@ApiTags('Favorites')
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favsService: FavoritesService) {}

  /**
   * Remove favorite
   * [DELETE] /favorites
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Removes a favorite' })
  @UseGuards(UserGuard)
  async deleteFavorite(
    @Req() req: AuthRequest,
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const data = { fav_id: id, user_id: req.user.user_id };
    const response = await this.favsService.deleteFavorite(data);
    res.status(response.httpStatus).json(response);
  }
}
