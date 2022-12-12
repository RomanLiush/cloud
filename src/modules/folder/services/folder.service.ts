import { HttpException, Injectable } from "@nestjs/common";
import { FolderRepository } from "../repository";
import { CreateFolderDto, RenameFolderDto } from "../DOT";
import { Types } from "mongoose";
import { BucketService } from "../../bucket/services";
import { objectIdValidator } from "../../../helpers";
// const fs = require('fs');
import * as fs from "fs";
import * as rimraf from "rimraf";
import * as path from "path";

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
    if (candidate) {
      throw new HttpException('There is current folder.', 400);
    }
    //create a folder in db
    const folder_path = path.join(process.cwd(), 'static', body.folder_name);
    const created_folder_db = await this.folderRepository.create({
      ...new_folder,
      files_count: 0,
      folder_path
    });
    // await this.bucketService.incrementFolderCount(body.bucket_id);
    //create a folder in laptop
    //const created_folder_store = fs.mkdirSync(body.folder_path + body.folder_name);
    const created_folder_store = fs.mkdirSync(path.join(process.cwd(), "static", body.folder_name));

    return {created_folder_db, created_folder_store};
  }

  async deleteFolder(_id: Types.ObjectId, user_id: Types.ObjectId) {
    objectIdValidator(_id);
    const folder = await this.folderRepository.findOne({ _id, user_id});

    if (!folder) throw new HttpException('There is no folder.', 400);

    await this.folderRepository.delete(_id);
    await rimraf(String(folder.folder_path + folder.folder_name), () => {
      return 1;});
    // await this.bucketService.incrementFolderCount(_id);
    // await this.bucketService.decrementFolderCount(_id);

    return this.getAllFolders(user_id);
  }

  async renameFolder(
    _id: Types.ObjectId,
    user_id: Types.ObjectId,
    body: RenameFolderDto,
  ) {
    objectIdValidator(_id);
    const candidate = await this.folderRepository.findOne({ _id, user_id });
    if (!candidate) throw new HttpException('There is no folder.', 400);

    const folder_name = body.folder_name.split('/').reverse()[0];

    // const renameInLaptop = fs.rename(body.folder_path, body.folder_name, (err) => {
    //  console.log(err, 'ERR');
    // });
    const path_to_dir = await path.join(process.cwd(), "static", candidate.folder_name);

    let new_path = path_to_dir.split('/');
    const new_path_delete_old_name = new_path.splice(-1);

    // new_path.forEach((value, index) => {
    //   value = new_path[index] + '/';
    //   console.log(value);
    // })

    const new_path_builder = new_path.reduce((acc, sum) => acc + '/' + sum + '/') + body.folder_name;

    const renameInLaptop = await fs.rename(path_to_dir, new_path_builder, (err) => {
      return err
    });

    const renameInDB = await this.folderRepository.findOneAndUpdate({ _id, user_id }, {folder_name});
    return {renameInDB, renameInLaptop};

  }
}
