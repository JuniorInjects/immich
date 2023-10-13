import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

enum MapTheme {
  LIGHT = 'light',
  DARK = 'dark',
}

export class MapStylesDto {
  @IsString()
  name!: string;

  @IsString()
  url!: string;

  @IsEnum(MapTheme)
  @IsOptional()
  @ApiProperty({ type: String, enum: MapTheme, enumName: 'MapTheme', required: false })
  theme!: 'light' | 'dark' | undefined;
}
