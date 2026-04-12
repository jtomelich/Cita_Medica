import { Test, TestingModule } from '@nestjs/testing';
import { DoctoresController } from './doctores.controller';

describe('DoctoresController', () => {
  let controller: DoctoresController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DoctoresController],
    }).compile();

    controller = module.get<DoctoresController>(DoctoresController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
