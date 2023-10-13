import { MapStylesDto } from '@app/domain';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsBoolean, ValidateNested } from 'class-validator';

export class SystemConfigMapDto {
  @IsBoolean()
  enabled!: boolean;

  @IsArray()
  @ArrayMinSize(1)
  @Type(() => MapStylesDto)
  @ValidateNested({ each: true })
  styles!: MapStylesDto[];
}
