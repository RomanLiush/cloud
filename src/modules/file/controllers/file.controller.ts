import { Body, Controller, Delete, Get, Param, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileService } from '../services';
import { GetCurrentUserId } from '../../auth/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateFileDto, RenameFileDto } from "../DOT";
import { Types } from 'mongoose';
import { diskStorage } from "multer";
import { extname }  from 'path';


@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  // @Get()
  // getAllFiles(@GetCurrentUserId() user_id: Types.ObjectId) {
  //   return this.fileService.getAllFiles(user_id);
  // }
  // @Get(':id')
  // getFilesById(
  //   @GetCurrentUserId() user_id: Types.ObjectId,
  //   @Param('id') id: Types.ObjectId,
  // ) {
  //   return this.fileService.getOneFile(id, user_id);
  // }

  // @Post()
  // async createFile(
  //   @Body() body: CreateFileDto,
  //   @GetCurrentUserId() user_id: Types.ObjectId,
  // ) {
  //   return this.fileService.createFile(body, user_id);
  // }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    dest: 'files',
    storage: diskStorage({
      destination: './files',
      filename: (req, file, callback) => {
        const uniqueSuffix =
          Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        // const filename = `${file.originalname}-${uniqueSuffix}-${ext}`;
        const filename = `${file.originalname}`;
        callback(null, filename);
      }
    })
  }))
  async handleUpload(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateFileDto,
    @GetCurrentUserId() user_id: Types.ObjectId)
    {
      //console.log('file', file);
      //console.log('body', body);

      return this.fileService.createFile(file, body.bucket_id, body.folder_id, user_id, body)
    }

  // @Delete(':id')
  // deleteFile(
  //   @Param('id') id: Types.ObjectId,
  //   @GetCurrentUserId() user_id: Types.ObjectId,
  // ) {
  //   return this.fileService.deleteFile(id, user_id);
  // }
  //
  // @Post('rename/:id')
  // renameFile(
  //   @Body() body: RenameFileDto,
  //   @GetCurrentUserId() user_id: Types.ObjectId,
  //   @Param('id') id: Types.ObjectId,
  // ) {
  //   return this.fileService.renameFile(id, user_id, body);
  // }
}
