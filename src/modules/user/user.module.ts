import { Module } from '@nestjs/common';
import { UserService } from './services';
import { UserController } from './controllers';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas';
import { UsersRepository } from './repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UserService, UsersRepository],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
