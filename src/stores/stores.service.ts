import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { forkJoin, Observable } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { RankData } from './interfaces/rankData.interface';
import { WeathersService } from '../weathers/weathers.service';
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
    if (!this.apiKey) {
      throw new HttpException('商品ランキングのAPIキーを設定してください。', HttpStatus.BAD_REQUEST);
    }
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
      catchError(handleError(this.logger)),
    );
  }

  getResults(): Observable<Result> {
    return forkJoin({
      weathers: this.weathersService.getAllWeather(),
      ranking: this.getSalesRanking(),
    }).pipe(
      // tap(
      //   ({weathers, ranking}) => {
      //     this.logger.debug('Weather data: ' + JSON.stringify(weathers));
      //     this.logger.debug('Ranking data: ' + JSON.stringify(ranking));
      //   },
      // ),
      map(({weathers, ranking}) => {
        return formatResult(weathers, ranking)
      }),
      catchError(handleError(this.logger)),
    );
  }
}
