import { Test, TestingModule } from '@nestjs/testing';

import { NamingService } from './naming.service';

describe('NamingService', () => {
    let service: NamingService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [NamingService],
        }).compile();

        service = module.get<NamingService>(NamingService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
