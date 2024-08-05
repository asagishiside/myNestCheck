import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Observable, throwError } from 'rxjs';
import { AxiosResponse } from 'axios';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class StoresService {
  private readonly apiKey: string;
  private readonly apiUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>('yahooClientId');
    this.apiUrl = this.configService.get<string>('yahooApiUrl');
  }

  getSalesRanking(): Observable<AxiosResponse<any>> {
    const apiUrl = `${this.apiUrl}?appid=${this.apiKey}`;
    console.log('sales rannk');
    return this.httpService.get(apiUrl).pipe(
      map((response) => response.data),
      catchError((error) => {
        console.log(error);
        return throwError(() => new Error('Failed to fetch weather data'));
      }),
    );
  }
}
