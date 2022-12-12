import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/user';
import { AuthModule } from './modules/auth';
import { BucketModule } from './modules/bucket/bucket.module';
import { FolderModule } from './modules/folder/folder.module';
import { FileModule } from './modules/file/file.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './modules/auth/guards';
import { MulterModule } from "@nestjs/platform-express";

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(String(process.env.DB_URL)),
    MulterModule.registerAsync({
      useFactory: () => ({
        dest: './files',
      }),
    }),
    UserModule,
    AuthModule,
    BucketModule,
    FolderModule,
    FileModule
  ],
  providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {}
