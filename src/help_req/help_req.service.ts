import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HelpRequest } from './help_req.entity';
import { User } from '../user/user.entity';
import { S3Service } from '../s3/s3.service';

@Injectable()
export class HelpRequestService {
  constructor(
    @InjectRepository(HelpRequest)
    private readonly helpRequestRepository: Repository<HelpRequest>,
    private readonly s3Service: S3Service,
  ) {}

  async createHelpRequest(
    user: User,
    latitude: number,
    longitude: number,
    video: Express.Multer.File,
  ): Promise<HelpRequest> {
    // Upload video to S3
    const videoUrl = await this.s3Service.uploadFile(video, 'help-requests');

    // Create and save the help request in the database
    const helpRequest = this.helpRequestRepository.create({
      user,
      latitude,
      longitude,
      video_url: videoUrl,
    });

    return this.helpRequestRepository.save(helpRequest);
  }

  async getAllHelpRequests(): Promise<HelpRequest[]> {
    return this.helpRequestRepository.find();
  }
}
