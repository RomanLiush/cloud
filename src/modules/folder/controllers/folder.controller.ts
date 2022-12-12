import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { FolderService } from '../services';
import { GetCurrentUserId } from '../../auth/decorators';
import { CreateFolderDto, RenameFolderDto } from "../DOT";
import { Types } from 'mongoose';

@Controller('folder')
export class FolderController {
  constructor(private readonly folderService: FolderService) {}

  @Get()
  getAllFolders(@GetCurrentUserId() user_id: Types.ObjectId) {
    return this.folderService.getAllFolders(user_id);
  }
  @Get(':id')
  getFoldersById(
    @GetCurrentUserId() user_id: Types.ObjectId,
    @Param('id') id: Types.ObjectId,
  ) {
    return this.folderService.getOneFolder(id, user_id);
  }

  @Post()
  async createFolder(
    @Body() body: CreateFolderDto,
    @GetCurrentUserId() user_id: Types.ObjectId,
  ) {
    return this.folderService.createFolder(body, user_id);
  }

  @Delete(':id')
  deleteFolder(
    @Param('id') id: Types.ObjectId,
    @GetCurrentUserId() user_id: Types.ObjectId,
  ) {
    return this.folderService.deleteFolder(id, user_id);
  }

  @Post('rename/:id')
  renameFolder(
    @Body() body: RenameFolderDto,
    @GetCurrentUserId() user_id: Types.ObjectId,
    @Param('id') id: Types.ObjectId,
  ) {
    return this.folderService.renameFolder(id, user_id, body);
  }
}
