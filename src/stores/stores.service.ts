import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { forkJoin, Observable, throwError, tap } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { RankData } from './interfaces/rankData.interface';
import { WeathersService } from 'src/weathers/weathers.service';
import { Result } from './interfaces/result.interface';
import { formatResult, handleError } from './utils';

@Injectable()
export class StoresService {
  private readonly apiKey: string;
  private readonly apiUrl: string;
  private readonly logger = new Logger(StoresService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly weathersService: WeathersService,
  ) {
    this.apiKey = this.configService.get<string>('yahooClientId');
    this.apiUrl = this.configService.get<string>('yahooApiUrl');
  }

  getSalesRanking(): Observable<RankData[]> {
    const apiUrl = `${this.apiUrl}?appid=${this.apiKey}`;
    return this.httpService.get(apiUrl).pipe(
      map((response) => {
        return response.data['high_rating_trend_ranking']['ranking_data'].map(
          (item: RankData) => {
            return {
              rank: item['rank'],
              name: item['item_information']['name'],
            }
          },
        );
      }),
      catchError((error) => {
        this.logger.error(error);
        return throwError(() => new Error('Failed to fetch store data'));
      }),
    );
  }

  getResults(city: string = 'Tokyo'): Observable<Result> {
    return forkJoin({
      weather: this.weathersService.getWeather(city),
      ranking: this.getSalesRanking(),
    }).pipe(
      tap(
        ({weather, ranking}) => {
          this.logger.debug('Weather data: ' + JSON.stringify(weather));
          this.logger.debug('Ranking data: ' + JSON.stringify(ranking));
        },
      ),
      map(({weather, ranking}) => {
        return formatResult(weather, ranking)
      }),
      catchError(handleError(this.logger)),
    );
  }
}
