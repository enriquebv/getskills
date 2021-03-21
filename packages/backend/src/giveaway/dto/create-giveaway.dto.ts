import {
  IsEnum,
  IsNumber,
  IsString,
  MinLength,
  Min,
  Max,
} from 'class-validator';

type GiveawayTypes = 'twitch:channel-points' | 'twitch:bits';

const giveawayTypes: GiveawayTypes[] = ['twitch:channel-points', 'twitch:bits'];

interface RewardOptions {
  title: string;
  cost: number;
}

export default class CreateGiveawayDto {
  @IsString()
  @MinLength(1)
  title: string;

  @IsString()
  @MinLength(1)
  description: string;

  @IsString()
  @IsEnum(giveawayTypes)
  type: GiveawayTypes;

  @IsString()
  @MinLength(1)
  rewardTitle: string;

  @IsNumber()
  @Min(50)
  @Max(10000000)
  rewardCost: number;
}
