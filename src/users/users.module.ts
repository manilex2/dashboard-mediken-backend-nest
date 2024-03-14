import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { AfiliadoTitular, Beneficiario, Broker, MedikenUser } from './models';

@Module({
  imports: [
    SequelizeModule.forFeature([
      MedikenUser,
      Beneficiario,
      Broker,
      AfiliadoTitular,
    ]),
  ],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
