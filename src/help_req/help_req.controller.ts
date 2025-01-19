import {
  Controller,
  Post,
  Get,
  UseInterceptors,
  UploadedFile,
  Body,
  Param,
  Delete,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { HelpRequestService } from './help_req.service';
import { User } from '../user/user.entity'; // Assuming user is retrieved from a middleware or JWT

@Controller('help-requests')
export class HelpRequestController {
  constructor(private readonly helpRequestService: HelpRequestService) {}

  @Post(':userId')
  @UseInterceptors(FileInterceptor('video'))
  async createHelpRequest(
    @Param('userId') userId: number,
    @UploadedFile() video: Express.Multer.File,
    @Body('latitude') latitude: number,
    @Body('longitude') longitude: number,
    @Body('rank') rank: number,
    @Body('name') name: string,
    @Body('description') description: string,
  ) {
    const user = { user_id: userId } as User; // Replace with actual user retrieval logic
    return this.helpRequestService.createHelpRequest(
      user,
      latitude,
      longitude,
      video,
      rank,
      name,
      description,
    );
  }

  @Get()
  async getAllHelpRequests() {
    return this.helpRequestService.getAllHelpRequests();
  }

  @Delete(':requestId')
  async deleteHelpRequest(@Param('requestId') requestId: number) {
    return this.helpRequestService.deleteHelpRequest(requestId);
  }

  @Get('nearby')
  async getNearbyLocations(
    @Query('latitude') latitude: string,
    @Query('longitude') longitude: string,
  ) {
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lon)) {
      throw new BadRequestException('Invalid latitude or longitude');
    }

    return this.helpRequestService.getNearbyLocations(lat, lon);
  }
}
