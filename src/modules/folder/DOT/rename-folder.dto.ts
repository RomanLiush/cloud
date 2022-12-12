import { IsString } from 'class-validator';

export class RenameFolderDto {
  @IsString()
  folder_name: string;
}
