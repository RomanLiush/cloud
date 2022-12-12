import { IsString } from 'class-validator';
import { Types } from 'mongoose';

export class RenameFileDto {
  @IsString()
  file_name: string;
}
