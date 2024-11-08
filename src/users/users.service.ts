import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(user: Partial<User>): Promise<User> {
    const newUser = this.userRepository.create(user);
    return this.userRepository.save(newUser);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(uuid: string): Promise<User> {
    return this.userRepository.findOneBy({ uuid });
  }

  async update(uuid: string, updateUserDto: Partial<User>): Promise<User> {
    await this.userRepository.update(uuid, updateUserDto);
    return this.findOne(uuid);
  }

  async remove(uuid: string): Promise<void> {
    await this.userRepository.delete(uuid);
  }
}
