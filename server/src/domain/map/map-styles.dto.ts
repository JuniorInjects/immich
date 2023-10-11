import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl } from 'class-validator';

export class MapStylesDto {
  @IsString()
  name!: string;

  @IsUrl()
  url!: string;

  @IsString()
  @ApiProperty({ type: String, enum: ['light', 'dark'] })
  theme!: 'light' | 'dark' | undefined;
}
