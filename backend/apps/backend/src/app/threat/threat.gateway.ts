import { Logger } from '@nestjs/common';
import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';

import { Threat } from './threat.entity';

import { Server, Socket } from 'socket.io';

@WebSocketGateway({
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
})
export class ThreatsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly logger = new Logger(ThreatsGateway.name);

    @WebSocketServer()
    server!: Server;

    handleConnection(client: Socket) {
        this.logger.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('subscribeThreatUpdates')
    handleSubscribe(client: Socket) {
        client.join('threat-updates');
        return { event: 'subscribed', data: 'Successfully subscribed to threat updates' };
    }

    emitThreatCreated(threat: Threat) {
        this.server.to('threat-updates').emit('threatCreated', threat);
    }

    emitThreatUpdated(threat: Threat) {
        this.server.to('threat-updates').emit('threatUpdated', threat);
    }
}
