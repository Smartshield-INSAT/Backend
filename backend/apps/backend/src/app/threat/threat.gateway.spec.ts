/* eslint-disable @typescript-eslint/no-explicit-any */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Socket, io as ClientIO } from 'socket.io-client';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThreatsModule } from './threat.module';

describe('ThreatsGateway', () => {
    let app: INestApplication;
    let socket1: Socket;
    let socket2: Socket;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot({
                    type: 'postgres',
                    host: 'localhost',
                    port: 5432,
                    username: 'test',
                    password: 'test',
                    database: 'test',
                    entities: [__dirname + '/**/*.entity{.ts,.js}'],
                    synchronize: true,
                }),
                ThreatsModule,
            ],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.listen(3001);

        // Create two socket clients for testing
        socket1 = ClientIO('http://localhost:3001', {
            transports: ['websocket'],
        });

        socket2 = ClientIO('http://localhost:3001', {
            transports: ['websocket'],
        });
    });

    beforeEach(async () => {
        // Subscribe both sockets to threat updates
        await Promise.all([
            new Promise<void>((resolve) => {
                socket1.emit('subscribeThreatUpdates', {}, () => resolve());
            }),
            new Promise<void>((resolve) => {
                socket2.emit('subscribeThreatUpdates', {}, () => resolve());
            }),
        ]);
    });

    afterAll(async () => {
        socket1.disconnect();
        socket2.disconnect();
        await app.close();
    });

    it('should handle threat creation process', (done) => {
        const mockThreat = {
            title: 'Test Threat',
            description: 'Test Description',
            severity: 'HIGH',
        };

        // Socket2 listens for the threatCreating event
        socket2.on('threatCreating', (payload) => {
            expect(payload).toMatchObject(mockThreat);
        });

        // Both sockets should receive the threatCreated event
        let receivedCount = 0;
        const threatCreatedHandler = () => {
            receivedCount++;
            if (receivedCount === 2) {
                done();
            }
        };

        socket1.on('threatCreated', threatCreatedHandler);
        socket2.on('threatCreated', threatCreatedHandler);

        // Socket1 initiates the threat creation
        socket1.emit('createThreat', mockThreat, (response: any) => {
            expect(response.event).toBe('threatCreating');
            expect(response.data).toMatchObject(mockThreat);

            // Simulate the threat being created in the database
            socket1.emit('threatCreated', {
                ...mockThreat,
                id: '123',
                status: 'OPEN',
                createdAt: new Date(),
            });
        });
    });
});
