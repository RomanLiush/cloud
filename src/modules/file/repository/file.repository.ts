import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';

import { File, FileDocument } from '../schemas';

@Injectable()
export class FileRepository {
  constructor(@InjectModel(File.name) private Model: Model<FileDocument>) {}

  async findOne(FilterQuery: FilterQuery<File>): Promise<File | null> {
    return this.Model.findOne(FilterQuery);
  }

  async find(FilterQuery: FilterQuery<File>): Promise<File[] | null> {
    return this.Model.find(FilterQuery);
  }

  async create(file: File): Promise<File> {
    const new_data = new this.Model(file);
    return new_data.save();
  }

  async findOneAndUpdate(
    FilterQuery: FilterQuery<File>,
    file: Partial<File>,
  ): Promise<File> {
    return this.Model.findOneAndUpdate(FilterQuery, file, {
      new: true,
    });
  }

  async delete(id: Types.ObjectId) {
    return this.Model.findByIdAndDelete(id);
  }
}
