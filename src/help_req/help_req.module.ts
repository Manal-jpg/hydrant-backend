import { Module } from '@nestjs/common';
import { HelpRequestService } from './help_req.service';
import { HelpRequestController } from './help_req.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HelpRequest } from './help_req.entity';
import { S3Service } from 'src/s3/s3.service';

@Module({
  imports: [TypeOrmModule.forFeature([HelpRequest])],
  providers: [HelpRequestService, S3Service],
  controllers: [HelpRequestController],
})
export class HelpReqModule {}
