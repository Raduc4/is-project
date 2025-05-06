import { Test, TestingModule } from '@nestjs/testing';
import { PizdetController } from './pizdet.controller';

describe('PizdetController', () => {
  let controller: PizdetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PizdetController],
    }).compile();

    controller = module.get<PizdetController>(PizdetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
