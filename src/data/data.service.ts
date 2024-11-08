import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Data } from 'src/entities/data.entity';
import { Repository } from 'typeorm';


@Injectable()
export class DataService {
  constructor(
    @InjectRepository(Data)
    private readonly dataRepository: Repository<Data>,
  ) {}

  async create(data: Partial<Data>): Promise<Data> {
    const newData = this.dataRepository.create(data);
    return this.dataRepository.save(newData);
  }
}
