import { IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateFileDto {
  @IsString()
  file_name: string;

  @IsString()
  folder_name: string;

  @IsString()
  folder_id: Types.ObjectId;

  @IsString()
  bucket_id: Types.ObjectId;
}
