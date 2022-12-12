import { HttpException, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { CreateBucketDto } from '../DTO';
import { BucketRepository } from '../repository';
import { objectIdValidator } from '../../../helpers';

@Injectable()
export class BucketService {
  constructor(private readonly bucketRepository: BucketRepository) {}

  async createBucket(bucket: CreateBucketDto, user_id: Types.ObjectId) {
    const candidate = await this.bucketRepository.findOne({
      ...bucket,
      user_id,
    });
    if (candidate) {
      throw new HttpException('there is bucket with current name', 400);
    }
    return this.bucketRepository.create({
      name: bucket.name,
      folders_count: 0,
      user_id,
    });
  }

  async delete(_id: Types.ObjectId, user_id: string) {
    objectIdValidator(_id);
    const candidate = await this.bucketRepository.findOne({ _id, user_id });
    if (!candidate) {
      throw new HttpException('there is no bucket', 400);
    }
    await this.bucketRepository.delete(_id);
    return this.bucketRepository.find({});
  }

  async rename(options, _id: Types.ObjectId, user_id: Types.ObjectId) {
    objectIdValidator(_id);
    const candidate = await this.bucketRepository.findOne({ _id, user_id });

    if (!candidate) {
      throw new HttpException('there is no bucket', 400);
    }

    return this.bucketRepository.findOneAndUpdate({ _id }, options);
  }

  async findAll(user_id: string) {
    return this.bucketRepository.find({ user_id });
  }

  async findOne(_id: Types.ObjectId, user_id: string) {
    objectIdValidator(_id);
    const candidate = await this.bucketRepository.findOne({ _id, user_id });

    if (!candidate) {
      throw new HttpException('there is no bucket', 400);
    }

    return candidate;
  }

  // async incrementFolderCount(_id: Types.ObjectId) {
  //   const bucket = await this.bucketRepository.findOne({ _id });
  //   console.log(bucket, '++++++++++++++++++++');
  //   return this.bucketRepository.findOneAndUpdate(
  //     { _id },
  //     { folders_count: bucket.folders_count + 1 },
  //   );
  // }
  //
  // async decrementFolderCount(_id: Types.ObjectId) {
  //   const bucket = await this.bucketRepository.findOne({ _id });
  //
  //   return this.bucketRepository.findOneAndUpdate(
  //     { _id },
  //     { folders_count: bucket.folders_count - 1 },
  //   );
  // }
}
