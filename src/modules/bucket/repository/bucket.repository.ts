import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from "mongoose";

import { Bucket, BucketDocument } from '../schemas';

@Injectable()
export class BucketRepository {
  constructor(@InjectModel(Bucket.name) private Model: Model<BucketDocument>) {}

  async findOne(userFilterQuery: FilterQuery<Bucket>): Promise<Bucket> {
    return this.Model.findOne(userFilterQuery);
  }

  async find(bucketFilterQuery: FilterQuery<Bucket>): Promise<Bucket[]> {
    return this.Model.find(bucketFilterQuery);
  }

  async create(bucket: Bucket): Promise<Bucket> {
    const new_data = new this.Model(bucket);
    return new_data.save();
  }

  async findOneAndUpdate(
    bucketFilterQuery: FilterQuery<Bucket>,
    bucket: Partial<Bucket>,
  ): Promise<Bucket> {
    return this.Model.findOneAndUpdate(bucketFilterQuery, bucket, {
      new: true,
    });
  }

  async delete(id: Types.ObjectId) {
    return this.Model.findByIdAndDelete(id);
  }
}
