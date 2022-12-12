import { Module } from '@nestjs/common';
import { FileService } from './services';
import { FileController } from './controllers/file.controller'
import { MongooseModule } from '@nestjs/mongoose';
import { File, FileSchema } from './schemas';
import { FileRepository } from './repository';
import { AuthModule } from '../auth';
import { BucketModule } from '../bucket/bucket.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: File.name, schema: FileSchema }]),
    AuthModule,
    BucketModule,
  ],
  providers: [FileService, FileRepository],
  controllers: [FileController],
})
export class FileModule {}
