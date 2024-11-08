import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { BaseService } from '../app/common/data_layer/base.service';

import { Data } from './entity/data.entity';

import { Repository } from 'typeorm';

@Injectable()
export class DataService extends BaseService<Data> {
    constructor(
        @InjectRepository(Data)
        dataRepository: Repository<Data>,
    ) {
        super(dataRepository);
    }
}
