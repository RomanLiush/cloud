import { HttpException, Injectable } from "@nestjs/common";
import { BucketService } from "../../bucket/services";
import { CreateFileDto, RenameFileDto } from "../DOT";
import { FileRepository } from "../repository";
import { Types } from "mongoose";
import * as fs from 'fs';
import path from "path";

@Injectable()
export class FileService {
  constructor(
    private readonly fileRepository: FileRepository,
    private readonly bucketService: BucketService,
  ) {}

  async createFile(file: Express.Multer.File,
                   bucket_id: Types.ObjectId,
                   folder_id: Types.ObjectId,
                   user_id: Types.ObjectId,
                   body: CreateFileDto
  ) {
    const { size, mimetype, filename, originalname } = file;
    const candidate = await this.fileRepository.findOne({folder_id, bucket_id, file_name: originalname, user_id})
    const folder = await this.fileRepository.findOne({folder_id, bucket_id});
    if(candidate) throw new HttpException('There is current file', 400);

    //TODO Check Users
    const path_to_file = await path.join(process.cwd(), "files", body.file_name);
    const path_to_dir = await path.join(process.cwd(), "static", body.folder_name)
    const copyFile = await fs.copyFile(path_to_file, path_to_dir, (err) => {
      return err;
    })

    return copyFile;
  }

}
