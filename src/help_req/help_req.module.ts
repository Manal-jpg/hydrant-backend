import { Module } from '@nestjs/common';
import { HelpReqService } from './help_req.service';
import { HelpReqController } from './help_req.controller';

@Module({
  providers: [HelpReqService],
  controllers: [HelpReqController]
})
export class HelpReqModule {}
