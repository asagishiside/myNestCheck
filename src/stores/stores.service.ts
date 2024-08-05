import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';
import { map } from 'rxjs/operators';

@Injectable()
export class StoresService {
  private readonly apiKey: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>('yahooClientId');
  }

  getSalesRanking(): Observable<object> {
    const apiUrl = `https://shopping.yahooapis.jp/ShoppingWebService/V1/highRatingTrendRanking?appid=${this.apiKey}`;
    return this.httpService.get(apiUrl).pipe(map((response) => response.data));
  }
}
