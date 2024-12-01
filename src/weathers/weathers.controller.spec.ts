import { Test, TestingModule } from '@nestjs/testing';
import { WeathersController } from './weathers.controller';
import { WeathersService } from './weathers.service'; // WeathersServiceをインポート

describe('WeathersController', () => {
  let controller: WeathersController;
  let service: WeathersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WeathersController],
      providers: [
        {
          provide: WeathersService, // WeathersServiceをモック
          useValue: {
            getAllWeather: jest.fn(), // メソッドのモックを追加
            // 必要に応じて他のメソッドもモック
          },
        },
      ],
    }).compile();

    controller = module.get<WeathersController>(WeathersController);
    service = module.get<WeathersService>(WeathersService); // WeathersServiceのインスタンスを取得
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
