import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from 'src/entities/user.entity'; // Ensure the path is correct

@Module({
  imports: [TypeOrmModule.forFeature([User])], // Import User entity here
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // Export if needed by other modules
})
export class UsersModule {}
