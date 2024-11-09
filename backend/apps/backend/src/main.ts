import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app/app.module';

import compression from 'compression';
import helmet from 'helmet';

async function bootstrap() {
    const app: NestExpressApplication = await NestFactory.create(AppModule);
    const globalPrefix = 'api';
    app.setGlobalPrefix(globalPrefix);

    app.enableCors();
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
        }),
    );

    const configuration = new DocumentBuilder()
        .setTitle('Smartshield')
        .setDescription('Smartshield API')
        .setVersion('1.0')
        .addTag('api')
        .build();

    const document = SwaggerModule.createDocument(app, configuration);

    SwaggerModule.setup('api', app, document);

    // for basic security
    app.use(helmet());

    // enabling Cross-origin resource sharing: allows resources to be requested from another domain
    app.enableCors({
        allowedHeaders: 'Content-Type, Accept, Authorization',
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    });

    // Use the compression middleware
    app.use(compression());

    const port = process.env.PORT || 3000;
    await app.listen(port);
    Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
}

bootstrap();
