import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Afiliado, Beneficiario, Broker, MedikenUser } from './models';
import { PasswordsController } from './passwords/passwords.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([MedikenUser, Beneficiario, Broker, Afiliado]),
  ],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController, PasswordsController],
})
export class UsersModule {}
