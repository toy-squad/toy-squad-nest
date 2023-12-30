import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.SERVER_PORT;

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

  // 파이프 추가
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // cookie-parser 사용
  app.use(cookieParser());

  // cors 설정
  const corsOptions = {
    allowedHeaders: ['content-type', 'authorization'],
    origin: [
      // FE
      'http://localhost:3000',
      'https://web-toy-squad-client-20zynm2mljtlwyix.sel4.cloudtype.app',
    ],
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT', 'OPTIONS'],
    credentials: true,
  };
  app.enableCors(corsOptions);

  // swagger을 제외한 모든 API는 맨앞에 '/api'를 붙인다.
  app.setGlobalPrefix('/api');

  await app.listen(PORT, () => {
    new Logger(`MODE ${process.env.NODE_ENV.toUpperCase()}`).localInstance.log(
      `APP LISTEN ON PORT: ${PORT}`,
    );
  });
}
bootstrap();
