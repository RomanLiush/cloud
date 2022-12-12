import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseInterceptors,
  UploadedFile,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { FileService } from '../services';
import { GetCurrentUserId } from '../../auth/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateFileDto } from '../DOT';
import { Types } from 'mongoose';
import { diskStorage } from 'multer';
import { Response } from 'express';
import { createReadStream } from 'fs';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get(':id')
  async getFilesById(
    @GetCurrentUserId() user_id: Types.ObjectId,
    @Param('id') id: Types.ObjectId,
    @Res() res: Response,
  ) {
    const filePath = await this.fileService.getOneFile(id, user_id);
    res.download(filePath);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      dest: 'files',
      storage: diskStorage({
        destination: './files',
        filename: (req, file, callback) => {
          const filename = `${file.originalname}`;
          callback(null, filename);
        },
      }),
    }),
  )
  async handleUpload(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateFileDto,
    @GetCurrentUserId() user_id: Types.ObjectId,
  ) {
    return this.fileService.createFile(
      file,
      body.bucket_id,
      body.folder_id,
      user_id,
    );
  }

  @Delete(':id')
  deleteFile(
    @Param('id') id: Types.ObjectId,
    @GetCurrentUserId() user_id: Types.ObjectId,
  ) {
    return this.fileService.deleteFile(id, user_id);
  }

  @Post('rename/:id')
  renameFile(
    @Body('file_name') file_name: string,
    @GetCurrentUserId() user_id: Types.ObjectId,
    @Param('id') id: Types.ObjectId,
  ) {
    return this.fileService.renameFile(id, user_id, file_name);
  }
}
