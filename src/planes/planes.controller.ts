import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { PlanesService } from "./planes.service";
import { CreatePlaneDto } from "./dtos/createPlane.dto";

@Controller("planes")
export class PlanesController {
  constructor(private readonly planesService: PlanesService) {}

  @Post()
  async create(@Body() planeData: CreatePlaneDto) {
    return this.planesService.create(planeData);
  }

  @Get("/find")
  async find(@Query("planeCode") planeCode: string) {
    return this.planesService.find(planeCode);
  }
}
