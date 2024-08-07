import { Controller, Get, Query } from '@nestjs/common';
import { WeathersService } from './weathers.service';
import { Observable } from 'rxjs';

@Controller('weathers')
export class WeathersController {
  constructor(private readonly weathersService: WeathersService) {}

  @Get('test')
  findAll(): string {
    return 'This action returns all weathers';
  }
  @Get()
  getWeather(@Query('city') city: string): Observable<object> {
    return this.weathersService.getWeather(city);
  }
}
