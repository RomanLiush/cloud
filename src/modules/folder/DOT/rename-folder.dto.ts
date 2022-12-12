import { IsString } from 'class-validator';
import { Types } from "mongoose";

export class RenameFolderDto {
  @IsString()
  folder_name: string;

  // @IsString()
  // folder_path: string;
}
