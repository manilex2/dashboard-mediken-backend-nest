import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configuration } from '../config/configuration';
import { validationSchema } from '../config/validation';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { SequelizeModule } from '@nestjs/sequelize';
import * as tedious from 'tedious';
import { MorganMiddleware } from '@nest-middlewares/morgan';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MulterModule } from '@nestjs/platform-express';
import { PowerbiModule } from './powerbi/powerbi.module';
import { JoiPipeModule, JoiSchemaOptions } from 'nestjs-joi';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: 'smtps://user@example.com:topsecret@smtp.example.com',
      template: {
        dir: process.cwd() + '/src/templates/',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
      defaults: {
        from: '"NOREPLY" <noreply@mediken.com.ec>',
      },
      preview: true,
    }),
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === 'development'
          ? `${process.cwd()}/config/env/development.env`
          : `${process.cwd()}/config/env/production.env`,
      isGlobal: true,
      load: [configuration],
      validationSchema,
    }),
    AuthModule,
    UsersModule,
    SequelizeModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        dialect: 'mssql',
        dialectModule: tedious,
        host: configService.get<string>('database.host'),
        password: configService.get<string>('database.pwd'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.user'),
        database: configService.get<string>('database.db'),
        autoLoadModels: true,
        synchronize: true,
        dialectOptions: {
          useUTC: false,
          options: {
            cryptoCredentialsDetails: {
              minVersion: 'TLSv1',
            },
          },
        },
        timezone: 'America/Guayaquil',
      }),
      inject: [ConfigService],
    }),
    MulterModule.register({
      dest: './uploads', // Directorio de destino para guardar los archivos temporales
    }),
    PowerbiModule,
    JoiPipeModule.forRoot({
      pipeOpts: {
        usePipeValidationException: true,
      },
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
@JoiSchemaOptions({
  allowUnknown: false,
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    MorganMiddleware.configure('dev');
    consumer
      .apply(MorganMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
