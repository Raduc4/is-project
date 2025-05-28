import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { JwtService } from '@nestjs/jwt';
import { PostsModule } from './tickets/tickets.module';
import { S3Module } from './s3/s3.module';
import { PaymentsModule } from './payments/payments.module';
import { FlightsModule } from './flights/flights.module';
import { GisNodeController } from './gis-node/gis-node.controller';
import { GisNodeService } from './gis-node/gis-node.service';
import { GisNodeModule } from './gis-node/gis-node.module';
import { PlanesController } from "./planes/planes.controller";
import { PlanesModule } from "./planes/planes.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: "envs/.account.env" }),
    AuthModule,
    UserModule,
    PrismaModule,
    PostsModule,
    S3Module,
    PaymentsModule,
    FlightsModule,
    GisNodeModule,
    PlanesModule,
  ],
  controllers: [GisNodeController],
  providers: [JwtService, GisNodeService],
})
export class AppModule {}
