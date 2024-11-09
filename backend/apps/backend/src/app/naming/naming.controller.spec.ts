import { Test, TestingModule } from '@nestjs/testing';

import { NamingController } from './naming.controller';
import { NamingService } from './naming.service';

describe('NamingController', () => {
    let controller: NamingController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [NamingController],
            providers: [NamingService],
        }).compile();

        controller = module.get<NamingController>(NamingController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
