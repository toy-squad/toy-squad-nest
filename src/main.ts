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

  /**
   * https://localhost:3000/swagger 브라우저 창에 입력시 스웨거가 생성됩니다.
   */
  SwaggerModule.setup('swagger', app, swaggerDocument);

  await app.listen(process.env.SERVER_PORT);
}
bootstrap();
