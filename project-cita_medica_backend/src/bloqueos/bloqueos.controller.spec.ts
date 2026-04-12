import { Test, TestingModule } from '@nestjs/testing';
import { BloqueosController } from './bloqueos.controller';

describe('BloqueosController', () => {
  let controller: BloqueosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BloqueosController],
    }).compile();

    controller = module.get<BloqueosController>(BloqueosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
