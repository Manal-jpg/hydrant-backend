import { Injectable, NotFoundException } from '@nestjs/common';
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
    rank: number,
  ): Promise<HelpRequest> {
    // Validate rank
    if (rank < 1 || rank > 6) {
      throw new Error('Rank must be an integer between 1 and 6.');
    }

    // Upload video to S3
    const videoUrl = await this.s3Service.uploadFile(video, 'help-requests');

    // Create and save the help request in the database
    const helpRequest = this.helpRequestRepository.create({
      user,
      latitude,
      longitude,
      video_url: videoUrl,
      rank,
    });

    return this.helpRequestRepository.save(helpRequest);
  }

  async getAllHelpRequests(): Promise<HelpRequest[]> {
    return this.helpRequestRepository.find();
  }

  async deleteHelpRequest(request_id: number): Promise<void> {
    const helpRequest = await this.helpRequestRepository.findOne({
      where: { request_id: request_id },
    });
    if (!helpRequest) {
      throw new NotFoundException(
        `Help request with ID ${request_id} not found.`,
      );
    }
    await this.helpRequestRepository.remove(helpRequest);
  }
}
