import { Controller, Get } from '@nestjs/common';
import { Observable } from 'rxjs';
import { StoresService } from './stores.service';
import { RankData } from './interfaces/rankData.interface';

@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Get('test')
  getHello(): string {
    return 'This action returns stores test';
  }

  @Get()
  getSalesRanking(): Observable<RankData[]> {
    return this.storesService.getSalesRanking();
  }

  @Get('result')
  getResults(): Observable<object> {
    return this.storesService.getResults();
  }

}
