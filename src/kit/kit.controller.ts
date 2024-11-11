import { KitService } from './kit.service';
@Controller('kit')
export class KitController {
  constructor(private readonly kitService: KitService) {}
}
