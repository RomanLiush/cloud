import { IsString } from 'class-validator';

export class RenameFileDto {
  @IsString()
  file_name: string;
}
