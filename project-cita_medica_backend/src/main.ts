import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Prefijo global 
  app.setGlobalPrefix('api');

  ;

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Citas Médicas API')
    .setDescription('API del sistema web de gestión de citas médicas')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Monta Swagger bajo /api/docs

  // usamos 'docs' + { useGlobalPrefix: true } para que quede en /api/docs
  SwaggerModule.setup('docs', app, document, { useGlobalPrefix: true });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();