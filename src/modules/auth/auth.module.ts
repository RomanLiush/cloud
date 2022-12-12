import { Module } from '@nestjs/common';
import { AuthService } from './services';
import { AuthController } from './controllers';
import { UserModule } from '../user';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('SECRET_KEY'),
        signOptions: {
          expiresIn: '2d',
        },
      }),
      inject: [ConfigService],
    }),
    UserModule,
    ConfigModule
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService, JwtModule, ConfigModule],
})
export class AuthModule {}
