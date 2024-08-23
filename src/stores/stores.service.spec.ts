import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { WeathersService } from '../weathers/weathers.service';
import { StoresService } from './stores.service';
import { of, throwError } from 'rxjs';
import { AxiosResponse } from 'axios';
import { RankData } from './interfaces/rankData.interface';
import { Result } from './interfaces/result.interface';
import { Logger } from '@nestjs/common';

describe('StoresService', () => {
  let service: StoresService;
  let httpService: HttpService;
  let weathersService: WeathersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StoresService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              switch (key) {
                case 'yahooClientId':
                  return 'testapikey';
                case 'yahooApiUrl':
                  return 'https://test-api-url.com';
              }
            }),
          },
        },
        {
          provide: WeathersService,
          useValue: {
            getAllWeather: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<StoresService>(StoresService);
    httpService = module.get<HttpService>(HttpService);
    weathersService = module.get<WeathersService>(WeathersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getSalesRanking', () => {
    it('should return sales ranking data', (done) => {
      const mockResponse: AxiosResponse = {
        data: {
          high_rating_trend_ranking: {
            ranking_data: [
              {
                rank: 1,
                item_information: { name: 'Item 1' },
              },
              {
                rank: 2,
                item_information: { name: 'Item 2' },
              },
            ],
          },
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          headers: undefined
        },
      };

      jest.spyOn(httpService, 'get').mockReturnValue(of(mockResponse));

      service.getSalesRanking().subscribe((data: RankData[]) => {
        expect(data.length).toBe(2);
        expect(data[0].rank).toBe(1);
        expect(data[0].name).toBe('Item 1');
        expect(data[1].rank).toBe(2);
        expect(data[1].name).toBe('Item 2');
        done();
      });
    });

    it('should handle error', (done) => {
      const error = new Error('Test error');
      const loggerSpyLog = jest.spyOn(Logger.prototype, 'error');
      jest.spyOn(httpService, 'get').mockImplementation(() => throwError(() => error));

      service.getSalesRanking().subscribe({
        next: () => {},
        error: (err) => {
          expect(loggerSpyLog).toHaveBeenCalledWith(error);
          expect(err.message).toBe('Error: Test error');
          done();
        },
      });
    });
  });

  describe('getResults', () => {
    it('should return results with weather and ranking data', (done) => {
      const mockWeatherData = { 'tokyo': { main: 'Clear', description: 'clear sky', temp: 25, maxTemp: 27, minTemp: 22 } };
      const mockRankingData: RankData[] = [
        { rank: '1', name: 'Item 1' },
        { rank: '2', name: 'Item 2' },
      ];

      jest.spyOn(weathersService, 'getAllWeather').mockReturnValue(of(mockWeatherData));
      jest.spyOn(service, 'getSalesRanking').mockReturnValue(of(mockRankingData));

      service.getResults().subscribe((result: Result) => {
        expect(result).toBeDefined();
        expect(result.weathers).toEqual(mockWeatherData);
        expect(result.ranking).toEqual(mockRankingData);
        done();
      });
    });
  });
});