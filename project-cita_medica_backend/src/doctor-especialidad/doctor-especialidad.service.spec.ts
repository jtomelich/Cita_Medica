import { Test, TestingModule } from '@nestjs/testing';
import { DoctorEspecialidadService } from './doctor-especialidad.service';

describe('DoctorEspecialidadService', () => {
  let service: DoctorEspecialidadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DoctorEspecialidadService],
    }).compile();

    service = module.get<DoctorEspecialidadService>(DoctorEspecialidadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
