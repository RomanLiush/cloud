import { HttpException, HttpStatus, Injectable, StreamableFile } from "@nestjs/common";
import { FileRepository } from '../repository';
import { Types } from 'mongoose';
import {
  createReadStream,
  existsSync,
  ReadStream,
  renameSync,
  unlinkSync,
} from 'fs';
import { join } from 'path';
import { FolderService } from '../../folder/services';

@Injectable()
export class FileService {
  constructor(
    private readonly fileRepository: FileRepository,
    private readonly folderService: FolderService,
  ) {}

  async getOneFile(_id: Types.ObjectId, user_id: Types.ObjectId) {
    const file = await this.fileRepository.findOne({ _id, user_id });
    if (!file)
      throw new HttpException('There is no file', HttpStatus.BAD_REQUEST);
    return join(process.cwd(), 'static', file.file_path);
  }

  async createFile(
    file: Express.Multer.File,
    bucket_id: Types.ObjectId,
    folder_id: Types.ObjectId,
    user_id: Types.ObjectId,
  ) {
    const { size, mimetype, originalname } = file;
    const candidate = await this.fileRepository.findOne({
      folder_id,
      bucket_id,
      user_id,
      file_size: size,
      mimetype,
      file_name: originalname,
    });
    const oldFilePath = join(process.cwd(), 'files', originalname);

    if (candidate) {
      unlinkSync(oldFilePath);
      throw new HttpException('There is current file', 400);
    }
    const folder = await this.folderService.getOneFolder(folder_id, user_id);

    const newFilePath = join(
      process.cwd(),
      'static',
      folder.folder_path,
      originalname,
    );
    renameSync(oldFilePath, newFilePath);

    return this.fileRepository.create({
      folder_id,
      bucket_id,
      user_id,
      file_size: size,
      mimetype,
      file_name: originalname,
      file_path: join(folder.folder_path, originalname),
    });
  }

  async deleteFile(_id: Types.ObjectId, user_id: Types.ObjectId) {
    const candidate = await this.fileRepository.findOne({ _id, user_id });
    if (candidate) {
      const filePath = join(process.cwd(), 'static', candidate.file_path);
      if (existsSync(filePath)) unlinkSync(filePath);
    }
    return this.fileRepository.delete(_id);
  }

  async renameFile(
    _id: Types.ObjectId,
    user_id: Types.ObjectId,
    file_name: string,
  ) {
    const candidate = await this.fileRepository.findOne({ _id, user_id });
    if (!candidate)
      throw new HttpException('There is no file', HttpStatus.BAD_REQUEST);
    const oldFilePath = join(process.cwd(), 'static', candidate.file_path);

    if (!existsSync(oldFilePath))
      throw new HttpException('No file', HttpStatus.BAD_REQUEST);

    const folder = await this.folderService.getOneFolder(
      candidate.folder_id,
      user_id,
    );
    const newFileName = `${file_name}.${candidate.file_name.split('.').pop()}`;

    const newFilePath = join(
      process.cwd(),
      'static',
      folder.folder_path,
      newFileName,
    );

    renameSync(oldFilePath, newFilePath);
    await this.fileRepository.findOneAndUpdate(
      { _id, user_id },
      {
        file_name: newFileName,
        file_path: join(folder.folder_path, newFileName),
      },
    );
    return this.fileRepository.findOne({ _id, user_id });
  }
}
