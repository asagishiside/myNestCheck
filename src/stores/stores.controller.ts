import { Body, Controller, Get, Post } from '@nestjs/common';
import { Observable } from 'rxjs';
import { StoresService } from './stores.service';
import { RankData } from './interfaces/rankData.interface';
import { GetResultDto } from './dto/getResultDto';

@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Get('test')
  getHello(): string {
    return 'This action returns all stores';
  }

  @Get()
  getSalesRanking(): Observable<RankData[]> {
    return this.storesService.getSalesRanking();
  }

  @Get('result')
  getResults(): Observable<object> {
    return this.storesService.getResults();
  }

  @Post('result')
  getResult(@Body() body: GetResultDto): Observable<object> {
    return this.storesService.getResults(body.city);
  }
}
