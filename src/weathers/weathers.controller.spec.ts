import { Test, TestingModule } from '@nestjs/testing';
import { WeathersController } from './weathers.controller';

describe('WeathersController', () => {
  let controller: WeathersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WeathersController],
    }).compile();

    controller = module.get<WeathersController>(WeathersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
