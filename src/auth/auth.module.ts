import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategys/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategys/jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  MedikenUser,
  Beneficiario,
  Broker,
  AfiliadoTitular,
} from '../users/models';

@Module({
  imports: [
    SequelizeModule.forFeature([
      MedikenUser,
      Beneficiario,
      Broker,
      AfiliadoTitular,
    ]),
    PassportModule.register({ session: true }),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: { expiresIn: '6h' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
