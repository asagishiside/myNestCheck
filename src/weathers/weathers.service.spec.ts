import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of, throwError } from 'rxjs';
import { WeathersService } from './weathers.service';
import { Logger } from '@nestjs/common';
import { AxiosResponse } from 'axios';

describe('WeathersService', () => {
  let service: WeathersService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeathersService,
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
                case 'weatherApiKey':
                  return 'test-api-key';
                case 'weatherApiUrl':
                  return 'http://test-api-url';
              }
            }),
          },
        },
      ],
    }).compile();

    service = module.get<WeathersService>(WeathersService);
    httpService = module.get<HttpService>(HttpService)
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getWeather', () => {
    it('should return weather data for a given city', (done) => {
      const city = 'Tokyo';
      const result = { data: { main: 'Clear', description: 'clear sky', temp: 25, maxTemp: 27, minTemp: 22 } };
      jest.spyOn(httpService, 'get').mockImplementation(() => of(result as AxiosResponse));

      service.getWeather(city).subscribe((data) => {
        expect(data).toEqual(result.data);
        expect(httpService.get).toHaveBeenCalledWith('http://test-api-url?q=Tokyo&appid=test-api-key&units=metric');
        done();
      });
    });

    it('should handle error', (done) => {
      const city = 'Tokyo';
      const error = new Error('Test error');
      const loggerSpyLog = jest.spyOn(Logger.prototype, 'error');
      jest.spyOn(httpService, 'get').mockImplementation(() => throwError(() => error));

      service.getWeather(city).subscribe({
        next: () => {},
        error: (err) => {
          expect(loggerSpyLog).toHaveBeenCalledWith(error);
          expect(err.message).toBe('Error: Test error');
          done();
        },
      });
    });
  });

  describe('getAllWeather', () => {
    it('should return weather data for all cities', (done) => {
      const weathersData = {
        Tokyo: {
          main: {
          temp: 25,
          temp_min: 22,
          temp_max: 27,
          },
          weather: [{
            main:"Clear",
            description:"clear sky",
          }],
          name: "Tokyo"
        },
        Osaka: {
          main: {
          temp: 25,
          temp_min: 22,
          temp_max: 27,
          },
          weather: [{
            main:"Clear",
            description:"clear sky",
          }],
          name: "Osaka"
        },
        Fukuoka: {
          main: {
          temp: 25,
          temp_min: 22,
          temp_max: 27,
          },
          weather: [{
            main:"Clear",
            description:"clear sky",
          }],
          name: "Fukuoka"
        },
        Sapporo: {
          main: {
          temp: 25,
          temp_min: 22,
          temp_max: 27,
          },
          weather: [{
            main:"Clear",
            description:"clear sky",
          }],
          name: "Sapporo"
        },
        Nagoya: {
          main: {
          temp: 25,
          temp_min: 22,
          temp_max: 27,
          },
          weather: [{
            main:"Clear",
            description:"clear sky",
          }],
          name: "Nagoya"
        },
      }
      const citiesWeather = {
        Tokyo: { main: 'Clear', description: 'clear sky', temp: 25, maxTemp: 27, minTemp: 22 },
        Osaka: { main: 'Clear', description: 'clear sky', temp: 25, maxTemp: 27, minTemp: 22 },
        Sapporo: { main: 'Clear', description: 'clear sky', temp: 25, maxTemp: 27, minTemp: 22 },
        Nagoya: { main: 'Clear', description: 'clear sky', temp: 25, maxTemp: 27, minTemp: 22 },
        Fukuoka: { main: 'Clear', description: 'clear sky', temp: 25, maxTemp: 27, minTemp: 22 },
      };
      const cityNames = Object.keys(citiesWeather);

      jest.spyOn(httpService, 'get').mockImplementation((url) => {
        const cityName = cityNames.find(city => url.includes(city));
        if (cityName) {
          return of({ data: weathersData[cityName] } as AxiosResponse);
        }
        return throwError(() => new Error('City not found'));
      });

      service.getAllWeather().subscribe((data) => {
        expect(data).toEqual(citiesWeather);
        expect(httpService.get).toHaveBeenCalledTimes(5);
        done();
      });
    });

    it('should handle error in one of the requests', (done) => {
      const weatherData = {
        Tokyo: {
          main: {
          temp: 25,
          temp_min: 22,
          temp_max: 27,
          },
          weather: [{
            main:"Clear",
            description:"clear sky",
          }],
          name: "Tokyo"
        },
        Osaka: new Error('Test error'),
        Fukuoka: {
          main: {
          temp: 25,
          temp_min: 22,
          temp_max: 27,
          },
          weather: [{
            main:"Clear",
            description:"clear sky",
          }],
          name: "Fukuoka"
        },
        Sapporo: {
          main: {
          temp: 25,
          temp_min: 22,
          temp_max: 27,
          },
          weather: [{
            main:"Clear",
            description:"clear sky",
          }],
          name: "Sapporo"
        },
        Nagoya: {
          main: {
          temp: 25,
          temp_min: 22,
          temp_max: 27,
          },
          weather: [{
            main:"Clear",
            description:"clear sky",
          }],
          name: "Nagoya"
        },
      }

      const cityNames = Object.keys(weatherData);
      jest.spyOn(httpService, 'get').mockImplementation((url) => {
        const cityName = cityNames.find(city => url.includes(city));
        if (cityName) {
          const cityWeather = weatherData[cityName];
          if (cityWeather instanceof Error) {
            return throwError(() => cityWeather);
          }
          return of({ data: cityWeather } as AxiosResponse);
        }
        return throwError(() => new Error('City not found'));
      });
      const loggerSpyLog = jest.spyOn(Logger.prototype, 'error');

      service.getAllWeather().subscribe({
        next: () => {},
        error: (err) => {
          expect(loggerSpyLog).toHaveBeenCalledWith(new Error('Test error'));
          expect(err.message).toBe('Error: Test error');
          done();
        },
      });
    });
  });
});
