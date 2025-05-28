import { Module } from '@nestjs/common';
import { GisNodeService } from './gis-node.service';
import { GisNodeController } from './gis-node.controller';

@Module({
  providers: [GisNodeService],
  controllers: [GisNodeController]
})
export class GisNodeModule {}
