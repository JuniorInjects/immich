import { MapStylesDto } from '@app/domain';
import { Type } from 'class-transformer';
import { IsArray, IsBoolean, ValidateNested } from 'class-validator';

export class SystemConfigMapDto {
  @IsBoolean()
  enabled!: boolean;

  @IsArray()
  @Type(() => MapStylesDto)
  @ValidateNested()
  styles!: MapStylesDto[];
}
