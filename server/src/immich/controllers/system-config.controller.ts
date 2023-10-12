import { SystemConfigDto, SystemConfigService, SystemConfigTemplateStorageOptionDto } from '@app/domain';
import { Body, Controller, Get, Put, Response } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response as Res } from 'express';
import { Authenticated } from '../app.guard';
import { UseValidation } from '../app.utils';

@ApiTags('System Config')
@Controller('system-config')
@Authenticated({ admin: true })
@UseValidation()
export class SystemConfigController {
  constructor(private readonly service: SystemConfigService) {}

  @Get()
  getConfig(): Promise<SystemConfigDto> {
    return this.service.getConfig();
  }

  @Get('defaults')
  getDefaults(): SystemConfigDto {
    return this.service.getDefaults();
  }

  @Put()
  updateConfig(@Body() dto: SystemConfigDto): Promise<SystemConfigDto> {
    return this.service.updateConfig(dto);
  }

  @Get('storage-template-options')
  getStorageTemplateOptions(): SystemConfigTemplateStorageOptionDto {
    return this.service.getStorageTemplateOptions();
  }

  @Get('map-light')
  getMapLight(@Response() res: Res) {
    res.header('Content-Type', 'application/json');
    res.sendFile('./assets/style-light.json', { root: process.cwd() });
  }

  @Get('map-dark')
  getMapDark(@Response() res: Res) {
    res.header('Content-Type', 'application/json');
    res.sendFile('./assets/style-dark.json', { root: process.cwd() });
  }
}
