import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { GisNodeService } from "./gis-node.service";
import { CreateGisNodeDto } from "./dtos/createGisNode.dto";

@Controller("gisNode")
export class GisNodeController {
  constructor(private readonly gisNodeService: GisNodeService) {}

  @Get()
  getGisNode(@Query("gisNodeName") gisNodeName: string) {
    return this.gisNodeService.searchGisNode(gisNodeName);
  }

  @Post()
  create(@Body() gisNode: CreateGisNodeDto) {
    return this.gisNodeService.create(gisNode);
  }
}
