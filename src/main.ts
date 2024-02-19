import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { AllExceptionsFilter } from './common/Error/exceptionFilter';
import helmet from 'helmet';
import * as csurf from 'csurf';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
// import { RolesGuard } from './auth/guards/role.guard';
// import { DefaultPipe } from './auth/pipe/transform/default.pipe';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //to apply the class validator
  // app.useGlobalPipes(new DefaultPipe())
  app.useGlobalPipes(
    new ValidationPipe({
      //remove unlisted field
      whitelist: true,
      //show error for non white list
      forbidNonWhitelisted: true,
      //perhaps for production
      // disableErrorMessages:true
    }),
  );
  //for transformer
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  //for interceptor
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  // app.useGlobalGuards(new RolesGuard())
  const config = new DocumentBuilder()
    .setTitle('API DOC TEST')
    .setDescription('The Test API')
    .setVersion('1.0')
    .addTag('APIs')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api_doc', app, document);
  // app.setGlobalPrefix('api');
  app.use(cookieParser());
  app.use(helmet());
  // app.use(csurf({cookie:true}));
  app.enableCors({
    origin:['http://localhost:3011','https://50ee-196-191-221-141.ngrok-free.app'],
    credentials:true
  });
  await app.listen(7000);
}
bootstrap();
