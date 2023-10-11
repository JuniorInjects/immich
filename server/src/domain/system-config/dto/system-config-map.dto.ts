import { MapStylesDto } from '@app/domain';
import { Type } from 'class-transformer';
import { IsBoolean, IsObject, ValidateNested } from 'class-validator';

export class SystemConfigMapDto {
  @IsBoolean()
  enabled!: boolean;

  @IsObject()
  @Type(() => MapStylesDto)
  @ValidateNested()
  styles!: MapStylesDto[];
}
