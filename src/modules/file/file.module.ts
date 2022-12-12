import { Module } from '@nestjs/common';
import { FileService } from './services';
import { FileController } from './controllers';
import { MongooseModule } from '@nestjs/mongoose';
import { File, FileSchema } from './schemas';
import { FileRepository } from './repository';
import { AuthModule } from '../auth';
import { BucketModule } from '../bucket/bucket.module';
import { FolderModule } from '../folder/folder.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: File.name, schema: FileSchema }]),
    AuthModule,
    BucketModule,
    FolderModule,
  ],
  providers: [FileService, FileRepository],
  controllers: [FileController],
})
export class FileModule {}
