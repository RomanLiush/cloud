import { HttpException, Injectable } from '@nestjs/common';
import { FolderRepository } from '../repository';
import { CreateFolderDto, RenameFolderDto } from '../DOT';
import { Types } from 'mongoose';
import { BucketService } from '../../bucket/services';
import { objectIdValidator } from '../../../helpers';
import { existsSync, mkdirSync, renameSync, rmSync } from 'fs';
import { join } from 'path';

@Injectable()
export class FolderService {
  constructor(
    private readonly folderRepository: FolderRepository,
    private readonly bucketService: BucketService,
  ) {}

  async getAllFolders(user_id: Types.ObjectId) {
    return (await this.folderRepository.find({ user_id })) || [];
  }

  async getOneFolder(_id: Types.ObjectId, user_id) {
    const validId = Types.ObjectId.isValid(_id);
    if (!validId) throw new HttpException('Invalid request data.', 400);

    const folder = await this.folderRepository.findOne({ _id, user_id });
    if (!folder) throw new HttpException('There is no folder.', 400);
    return folder;
  }

  async createFolder(body: CreateFolderDto, user_id: Types.ObjectId) {
    const new_folder = { ...body, user_id };
    const candidate = await this.folderRepository.findOne(new_folder);
    const bucket = await this.bucketService.findOne(body.bucket_id, user_id);

    if (candidate) {
      throw new HttpException('There is current folder.', 400);
    }

    const full_folder_path = join(
      process.cwd(),
      'static',
      bucket.bucket_folder,
      body.folder_name,
    );
    const folder_path = join(bucket.bucket_folder, body.folder_name);

    if (!existsSync(full_folder_path)) {
      mkdirSync(full_folder_path, { recursive: true });
    }

    await this.folderRepository.create({
      ...new_folder,
      files_count: 0,
      folder_path,
    });

    await this.bucketService.incrementFolderCount(body.bucket_id);
    return true;
  }

  async deleteFolder(_id: Types.ObjectId, user_id: Types.ObjectId) {
    objectIdValidator(_id);
    const folder = await this.folderRepository.findOne({ _id, user_id });

    if (!folder) throw new HttpException('There is no folder.', 400);

    await this.folderRepository.delete(_id);
    const folder_path = join(process.cwd(), 'static', folder.folder_path);

    if (existsSync(folder_path)) {
      rmSync(folder_path, { recursive: true });
    }

    await this.bucketService.decrementFolderCount(folder.bucket_id);

    return this.getAllFolders(user_id);
  }

  async renameFolder(
    _id: Types.ObjectId,
    user_id: Types.ObjectId,
    { folder_name }: RenameFolderDto,
  ) {
    objectIdValidator(_id);
    const candidate = await this.folderRepository.findOne({ _id, user_id });

    if (!candidate) throw new HttpException('There is no folder.', 400);
    const bucket = await this.bucketService.findOne(
      candidate.bucket_id,
      user_id,
    );

    const oldPath = join(
      process.cwd(),
      'static',
      bucket.bucket_folder,
      candidate.folder_name,
    );

    const newPath = join(
      process.cwd(),
      'static',
      bucket.bucket_folder,
      folder_name,
    );
    renameSync(oldPath, newPath);

    await this.folderRepository.findOneAndUpdate(
      { _id, user_id },
      { folder_name, folder_path: join(bucket.bucket_folder, folder_name) },
    );
    return true;
  }
}
