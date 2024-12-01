import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Observable, forkJoin } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { handleError } from '../stores/utils';
import { formatWeathers } from '../stores/utils';
import { Weathers } from '../stores/interfaces/weathers.interface';

@Injectable()
export class WeathersService {
  private readonly apiKey: string;
  private readonly apiUrl: string;
  private readonly logger = new Logger(WeathersService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>('weatherApiKey');
    this.apiUrl = this.configService.get<string>('weatherApiUrl');
  }

  getWeather(city: string): Observable<object> {
    if (!this.apiKey) {
      throw new HttpException(
        'API key is not provided',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    const apiUrl = `${this.apiUrl}?q=${city}&appid=${this.apiKey}&units=metric`;
    // this.logger.debug(WeathersService.name + ' is this name');
    return this.httpService.get(apiUrl).pipe(
      map((response) => response.data),
      catchError(handleError(this.logger)),
    );
  }

  getAllWeather(): Observable<Weathers> {
    if (!this.apiKey) {
      throw new HttpException(
        'API key is not provided',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    const cities = ['Tokyo', 'Osaka', 'Sapporo', 'Nagoya', 'Fukuoka'];
    const apiRequests = cities.map((city) => {
      const apiUrl = `${this.apiUrl}?q=${city}&appid=${this.apiKey}&units=metric`;
      return this.httpService.get(apiUrl).pipe(
        map((response) => response.data),
        catchError(handleError(this.logger)),
      );
    });
    return forkJoin(apiRequests).pipe(
      map((weathers) => {
        console.log(weathers);
        return formatWeathers(weathers);
      }),
    );
  }
}
