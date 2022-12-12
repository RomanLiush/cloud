import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { CreateBucketDto } from '../DTO';
import { Bucket } from '../schemas';
import { BucketService } from '../services';
import { Types } from 'mongoose';
import { GetCurrentUserId } from '../../auth/decorators';

@Controller('bucket')
export class BucketController {
  constructor(private readonly bucketService: BucketService) {}

  @Get()
  getAll(@Req() req) {
    return this.bucketService.findAll(req.user.id);
  }

  @Get(':id')
  getOne(@Req() req, @Param('id') id: Types.ObjectId) {
    return this.bucketService.findOne(id, req.user.id);
  }

  @Post()
  createBucket(@Body() bucket: CreateBucketDto, @Req() req): Promise<Bucket> {
    return this.bucketService.createBucket(bucket, req.user.id);
  }

  @Delete(':id')
  deleteBucket(@Param('id') id: Types.ObjectId, @Req() req): Promise<Bucket[]> {
    return this.bucketService.delete(id, req.user.id);
  }

  @Post('rename/:id')
  renameBucket(
    @Body() bucket: CreateBucketDto,
    @Param('id') id: Types.ObjectId,
    @GetCurrentUserId() user_id: Types.ObjectId,
  ) {
    return this.bucketService.rename(bucket, id, user_id);
  }
}
