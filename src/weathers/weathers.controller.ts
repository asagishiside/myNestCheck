import { Controller, Get, Post, Query, Body } from '@nestjs/common';
import { WeathersService } from './weathers.service';
import { Observable } from 'rxjs';
import { Weathers } from '../stores/interfaces/weathers.interface';
import { GetWeatherDto } from '../stores/dto/getWeatherDto';

@Controller('weathers')
export class WeathersController {
  constructor(private readonly weathersService: WeathersService) {}

  @Get('test')
  findAll(): string {
    return 'This action returns weathers test';
  }
  @Get()
  getWeather(@Query('city') city: string): Observable<object> {
    return this.weathersService.getWeather(city);
  }

  @Post()
  getResult(@Body() body: GetWeatherDto): Observable<object> {
    return this.weathersService.getWeather(body.city);
  }

  @Get('all')
  getAllWeather(): Observable<Weathers> {
    return this.weathersService.getAllWeather();
  }
}
