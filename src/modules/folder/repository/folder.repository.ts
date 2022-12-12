import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from "mongoose";

import { Folder, FolderDocument } from '../schemas';

@Injectable()
export class FolderRepository {
  constructor(@InjectModel(Folder.name) private Model: Model<FolderDocument>) {}

  async findOne(FilterQuery: FilterQuery<Folder>): Promise<Folder | null> {
    return this.Model.findOne(FilterQuery);
  }

  async find(FilterQuery: FilterQuery<Folder>): Promise<Folder[] | null> {
    return this.Model.find(FilterQuery);
  }

  async create(folder: Folder): Promise<Folder> {
    const new_data = new this.Model(folder);
    return new_data.save();
  }

  async findOneAndUpdate(
    FilterQuery: FilterQuery<Folder>,
    folder: Partial<Folder>,
  ): Promise<Folder> {
    return this.Model.findOneAndUpdate(FilterQuery, folder, {
      new: true
    });
  }

  async delete(id: Types.ObjectId) {
    return this.Model.findByIdAndDelete(id);
  }
}
