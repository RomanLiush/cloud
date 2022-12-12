import { Module } from '@nestjs/common';
import { FolderService } from './services';
import { FolderController } from './controllers';
import { MongooseModule } from '@nestjs/mongoose';
import { Folder, FolderSchema } from './schemas';
import { FolderRepository } from './repository';
import { AuthModule } from '../auth';
import { BucketModule } from '../bucket/bucket.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Folder.name, schema: FolderSchema }]),
    AuthModule,
    BucketModule,
  ],
  providers: [FolderService, FolderRepository],
  controllers: [FolderController],
  exports: [FolderService],
})
export class FolderModule {}
