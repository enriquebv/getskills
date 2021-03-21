import { IsOptional, IsString, MinLength } from 'class-validator';

export default class UpdateGiveawayDto {
  @IsString()
  @MinLength(3)
  title: string;

  @IsString()
  @MinLength(10)
  description: string;
}
