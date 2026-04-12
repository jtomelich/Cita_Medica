import { Test, TestingModule } from '@nestjs/testing';
import { DoctorEspecialidadController } from './doctor-especialidad.controller';

describe('DoctorEspecialidadController', () => {
  let controller: DoctorEspecialidadController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DoctorEspecialidadController],
    }).compile();

    controller = module.get<DoctorEspecialidadController>(DoctorEspecialidadController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
