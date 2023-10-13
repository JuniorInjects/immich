import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class MapStylesDto {
  @IsString()
  name!: string;

  @IsString()
  url!: string;

  @ApiProperty({ type: String, enum: ['light', 'dark'], required: false })
  theme!: 'light' | 'dark' | undefined;
}
