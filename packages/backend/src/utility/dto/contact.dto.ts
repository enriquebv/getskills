import { IsEmail, IsString, MinLength } from 'class-validator';

export default class ContactDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(1)
  message: string;
}
