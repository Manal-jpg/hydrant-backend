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
    name: string,
    description: string,
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
      name,
      description,
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

  async getNearbyLocations(
    latitude: number,
    longitude: number,
    radius: number = 50,
  ): Promise<any[]> {
    const locations = await this.helpRequestRepository.find({
      select: ['latitude', 'longitude'],
    });

    const toRadians = (degree: number) => degree * (Math.PI / 180);

    return locations.filter((location) => {
      const lat1 = toRadians(latitude);
      const lon1 = toRadians(longitude);
      const lat2 = toRadians(location.latitude);
      const lon2 = toRadians(location.longitude);

      const dLat = lat2 - lat1;
      const dLon = lon2 - lon1;

      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = 6371 * c; // Earth's radius in kilometers

      return distance <= radius;
    });
  }
}
