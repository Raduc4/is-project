import { Module } from "@nestjs/common";
import { TicketsService } from "./tickets.service";
import { TicketsController } from "./tickets.controller";
import { ImagesService } from "src/s3/s3.service";

@Module({
  providers: [TicketsService, ImagesService],
  controllers: [TicketsController],
})
export class PostsModule {}
