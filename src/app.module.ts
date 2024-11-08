import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Data } from './entities/data.entity';
import { DataModule } from './data/data.module';
import { Server } from './entities/server.entity';
import { ServerModule } from './server/server.module';


@Module({
  imports: [UsersModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306, // Default MySQL port
      username: 'root', // Replace with your MySQL username if different
      password: '', // Add your MySQL password if you set one
      database: 'smart_shield', // Replace with the name of your database
      entities: [User, Data, Server], // Automatically load entities for simplicity
      synchronize: true, // Set to true for development only

    }),
    DataModule,
    ServerModule,
    

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
