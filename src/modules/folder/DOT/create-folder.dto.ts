import { IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateFolderDto {
  @IsString()
  folder_name: string;

  // @IsString()
  // folder_path: string;

  @IsString()
  bucket_id: Types.ObjectId;
}
