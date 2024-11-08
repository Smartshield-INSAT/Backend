import { Module } from '@nestjs/common';
import { ServerService } from './server.service';
import { ServerController } from './server.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Server } from 'src/entities/server.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Server])],
  providers: [ServerService],
  controllers: [ServerController]
})
export class ServerModule {}
