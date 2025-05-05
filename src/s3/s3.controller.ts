import { Body, Controller, Post } from '@nestjs/common';
import { ImagesService, MType } from './s3.service';
@Controller('s3')
export class S3Controller {
  constructor() {}
}
