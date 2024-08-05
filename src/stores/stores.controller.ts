import { Controller, Get } from '@nestjs/common';
import { map, Observable, tap } from 'rxjs';
import { StoresService } from './stores.service';

@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Get('test')
  getHello(): string {
    return 'This action returns all stores';
  }

  @Get()
  getSalesRanking(): Observable<object> {
    const response: Observable<object> = this.storesService.getSalesRanking();
    return response.pipe(
      tap((response) => {
        console.log('--------test');
        console.log(response['high_rating_trend_ranking']);
      }),
      map((response) => {
        return response['high_rating_trend_ranking']['ranking_data'].map(
          (item: { [key: string]: string }) => {
            console.log(item);
            const items = {
              rank: item['rank'],
              name: item['item_information']['name'],
            };
            return items;
          },
        );
      }),
    );
  }
}
