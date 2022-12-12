import { IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateFileDto {
  @IsString()
  folder_id: Types.ObjectId;

  @IsString()
  bucket_id: Types.ObjectId;
}
