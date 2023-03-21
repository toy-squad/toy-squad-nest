import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Toy-Squad Server Swagger')
    .setDescription('토이스쿼드 서버 스웨거 입니다.')
    .setVersion('1.0')
    .addTag('Toy-Squads')
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('api', app, swaggerDocument);

  await app.listen(process.env.SERVER_PORT);
}
bootstrap();
