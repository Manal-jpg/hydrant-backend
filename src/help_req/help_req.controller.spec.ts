import { Test, TestingModule } from '@nestjs/testing';
import { HelpReqController } from './help_req.controller';

describe('HelpReqController', () => {
  let controller: HelpReqController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HelpReqController],
    }).compile();

    controller = module.get<HelpReqController>(HelpReqController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
