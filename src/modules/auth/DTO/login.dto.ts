import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class LoginDTO {
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
