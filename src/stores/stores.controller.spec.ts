import { Test, TestingModule } from '@nestjs/testing';
import { StoresController } from './stores.controller';
import { StoresService } from './stores.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { WeathersService } from '../weathers/weathers.service';

describe('StoresController', () => {
  let controller: StoresController;
  let service: StoresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StoresController],
      providers: [
        {
          provide: StoresService, // StoresServiceをモック
          useValue: {
            getSalesRanking: jest.fn(), // メソッドのモックを追加
            getResults: jest.fn(), // 必要に応じて他のメソッドもモック
          },
        },
        {
          provide: HttpService, // HttpServiceをモック
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: ConfigService, // ConfigServiceをモック
          useValue: {
            get: jest.fn((key: string) => {
              switch (key) {
                case 'yahooClientId':
                  return 'test-api-key';
                case 'yahooApiUrl':
                  return 'https://test-api-url.com';
                default:
                  return null;
              }
            }),
          },
        },
        {
          provide: WeathersService, // WeathersServiceをモック
          useValue: {
            getAllWeather: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<StoresController>(StoresController);
    service = module.get<StoresService>(StoresService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
