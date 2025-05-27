import { Controller, Get, Query } from '@nestjs/common';
import { GisNodeService } from './gis-node.service';

@Controller('gisNode')
export class GisNodeController {
  constructor(private readonly gisNodeService: GisNodeService) {}

  @Get()
  getGisNode(@Query("gisNodeName") gisNodeName: string) {
    return this.gisNodeService.searchGisNode(gisNodeName)
  }
}
