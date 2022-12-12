import { Module } from '@nestjs/common';
import { BucketService } from './services';
import { BucketController } from './controllers';
import { Bucket, BucketSchema } from './schemas';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth';
import { BucketRepository } from './repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Bucket.name, schema: BucketSchema }]),
    AuthModule,
  ],
  providers: [BucketService, BucketRepository],
  controllers: [BucketController],
  exports: [BucketService]
})
export class BucketModule {}
