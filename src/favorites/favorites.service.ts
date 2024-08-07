import {
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Favorite } from 'src/entities/favorites';
import { Repository } from 'typeorm';
import { DeleteFavorite } from './interfaces/delete-favorite';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private readonly favoriteRepo: Repository<Favorite>,
  ) {}
  async deleteFavorite(data: DeleteFavorite) {
    console.log('data', data);
    const checkFavorite = await this.favoriteRepo.findOne({
      where: { fav_id: data.fav_id },
      relations: ['user'],
    });
    console.log('checkFavorite', checkFavorite);
    if (checkFavorite) {
      if (checkFavorite.user.user_id === data.user_id) {
        const favorite = await this.favoriteRepo.delete({
          fav_id: data.fav_id,
        });
        return {
          httpStatus: HttpStatus.OK,
          message: 'Deleted',
          favorite: favorite,
        };
      } else
        throw new UnauthorizedException(
          'User not authorized to delete this favorite',
        );
    } else throw new NotFoundException('Favorite not found');
  }
}
