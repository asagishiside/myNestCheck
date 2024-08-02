import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';
import { map } from 'rxjs/operators';

@Injectable()
export class WeathersService {
  private readonly apiKey: string;
  private readonly logger = new Logger(WeathersService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>('weatherApiKey');
  }

  getWeather(city: string): Observable<AxiosResponse<any>> {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.apiKey}`;
    this.logger.debug(WeathersService.name + ' is this name');
    return this.httpService.get(apiUrl).pipe(map((response) => response.data));
  }
}
