import { Module } from "@nestjs/common";
import { S3Controller } from "./s3.controller";
import { ImagesService } from "./s3.service";

@Module({
  imports: [],
  providers: [ImagesService],
  controllers: [S3Controller],
})
export class S3Module {}
