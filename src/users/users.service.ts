import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserDto } from './dto/user/userDTO';
import { InjectModel } from '@nestjs/sequelize';
import { MedikenUser, Beneficiario, Broker, AfiliadoTitular } from './models';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(MedikenUser)
    private readonly medikenUser: typeof MedikenUser,
    @InjectModel(Beneficiario)
    private readonly beneficiario: typeof MedikenUser,
    @InjectModel(Broker)
    private readonly broker: typeof Broker,
    @InjectModel(AfiliadoTitular)
    private readonly afiliadoTitular: typeof AfiliadoTitular,
  ) {}

  async updatePassword(id: string, data: UserDto): Promise<object> {
    let user: MedikenUser | Broker | Beneficiario | AfiliadoTitular;
    try {
      user = await this.medikenUser.findOne({
        where: {
          usuario: id,
        },
      });
      if (user) {
        const passwordMatch = await this.comparePasswords(
          data.clave.trim(),
          user.dataValues.clave.trim(),
        );
        if (passwordMatch) {
          const newPass = await this.hashPassword(data.nuevaClave);
          await this.medikenUser.update(
            { clave: newPass.trim() },
            {
              where: {
                usuario: id,
              },
            },
          );
          return {
            status: 200,
            message: 'Contraseña cambiada exitosamente',
          };
        } else {
          throw new HttpException(
            'Usuario no autorizado. Verifique usuario y contraseña',
            HttpStatus.FORBIDDEN,
          );
        }
      } else {
        user = await this.broker.findOne({
          where: {
            usuario: id,
          },
        });
        if (user) {
          const passwordMatch = await this.comparePasswords(
            data.clave.trim(),
            user.dataValues.clave.trim(),
          );
          if (passwordMatch) {
            const newPass = await this.hashPassword(data.nuevaClave);
            await this.broker.update(
              { clave: newPass.trim() },
              {
                where: {
                  usuario: id,
                },
              },
            );
            return {
              status: 200,
              message: 'Contraseña cambiada exitosamente',
            };
          } else {
            throw new HttpException(
              'Usuario no autorizado. Verifique usuario y contraseña',
              HttpStatus.FORBIDDEN,
            );
          }
        } else {
          user = await this.beneficiario.findOne({
            where: {
              usuario: id,
            },
          });
          if (user) {
            const passwordMatch = await this.comparePasswords(
              data.clave.trim(),
              user.dataValues.clave.trim(),
            );
            if (passwordMatch) {
              const newPass = await this.hashPassword(data.nuevaClave);
              await this.beneficiario.update(
                { clave: newPass.trim() },
                {
                  where: {
                    usuario: id,
                  },
                },
              );
              return {
                status: 200,
                message: 'Contraseña cambiada exitosamente',
              };
            } else {
              throw new HttpException(
                'Usuario no autorizado. Verifique usuario y contraseña',
                HttpStatus.FORBIDDEN,
              );
            }
          } else {
            user = await this.afiliadoTitular.findOne({
              where: {
                usuario: id,
              },
            });
            if (user) {
              const passwordMatch = await this.comparePasswords(
                data.clave.trim(),
                user.dataValues.clave.trim(),
              );
              if (passwordMatch) {
                const newPass = await this.hashPassword(data.nuevaClave);
                await this.afiliadoTitular.update(
                  { clave: newPass.trim() },
                  {
                    where: {
                      usuario: id,
                    },
                  },
                );
                return {
                  status: 200,
                  message: 'Contraseña cambiada exitosamente',
                };
              } else {
                throw new HttpException(
                  'Usuario no autorizado. Verifique usuario y contraseña',
                  HttpStatus.FORBIDDEN,
                );
              }
            }
          }
        }
      }
    } catch (error) {
      throw new HttpException(
        'Usuario no autorizado. Verifique usuario y contraseña',
        HttpStatus.FORBIDDEN,
      );
    }
    if (user === null) {
      throw new HttpException(
        'Usuario no autorizado. Verifique usuario y contraseña',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async updateProfileImg(id: string, data: Buffer): Promise<object> {
    let user: MedikenUser | Broker | Beneficiario | AfiliadoTitular;
    try {
      user = await this.medikenUser.findOne({
        where: {
          usuario: id,
        },
      });
      if (user) {
        await this.medikenUser.update(
          { img: data },
          {
            where: {
              usuario: id,
            },
          },
        );
        return {
          status: 200,
          message: 'Imágen actualizada exitosamente',
        };
      } else {
        user = await this.broker.findOne({
          where: {
            usuario: id,
          },
        });
        if (user) {
          await this.broker.update(
            { img: data },
            {
              where: {
                usuario: id,
              },
            },
          );
          return {
            status: 200,
            message: 'Imágen actualizada exitosamente',
          };
        } else {
          user = await this.beneficiario.findOne({
            where: {
              usuario: id,
            },
          });
          if (user) {
            await this.beneficiario.update(
              { img: data },
              {
                where: {
                  usuario: id,
                },
              },
            );
            return {
              status: 200,
              message: 'Imágen actualizada exitosamente',
            };
          } else {
            user = await this.afiliadoTitular.findOne({
              where: {
                usuario: id,
              },
            });
            if (user) {
              await this.afiliadoTitular.update(
                { img: data },
                {
                  where: {
                    usuario: id,
                  },
                },
              );
              return {
                status: 200,
                message: 'Imágen actualizada exitosamente',
              };
            } else {
              throw new HttpException(
                `No se pudo actualizar la imágen, por favor verifique`,
                HttpStatus.CONFLICT,
              );
            }
          }
        }
      }
    } catch (error) {
      throw new HttpException(
        `No se pudo actualizar la imágen, por favor verifique: ${error}`,
        HttpStatus.CONFLICT,
      );
    }
  }

  async getProfileImg(id: string): Promise<object> {
    let user: Promise<MedikenUser | Broker | Beneficiario | AfiliadoTitular>;
    try {
      user = this.medikenUser.findOne({
        where: {
          usuario: id,
        },
      });
      if (user && (await user).dataValues.img) {
        const imgBuffer: Buffer = (await user).dataValues.img;
        const imgBase64 = imgBuffer.toString('base64');
        return {
          status: 200,
          message: imgBase64,
        };
      } else {
        user = this.broker.findOne({
          where: {
            usuario: id,
          },
        });
        if (user && (await user).dataValues.img) {
          const imgBuffer: Buffer = (await user).dataValues.img;
          const imgBase64 = imgBuffer.toString('base64');
          return {
            status: 200,
            message: imgBase64,
          };
        } else {
          user = this.beneficiario.findOne({
            where: {
              usuario: id,
            },
          });
          if (user && (await user).dataValues.img) {
            const imgBuffer: Buffer = (await user).dataValues.img;
            const imgBase64 = imgBuffer.toString('base64');
            return {
              status: 200,
              message: imgBase64,
            };
          } else {
            user = this.afiliadoTitular.findOne({
              where: {
                usuario: id,
              },
            });
            if (user && (await user).dataValues.img) {
              const imgBuffer: Buffer = (await user).dataValues.img;
              const imgBase64 = imgBuffer.toString('base64');
              return {
                status: 200,
                message: imgBase64,
              };
            } else {
              throw new HttpException(
                `No se pudo encontrar la imágen usuario, por favor verifique`,
                HttpStatus.CONFLICT,
              );
            }
          }
        }
      }
    } catch (error) {
      throw new HttpException(
        `No se pudo encontrar la imágen para ese usuario, por favor verifique: ${error}`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async comparePasswords(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    // Verificar si la contraseña almacenada está hasheada
    const isHashed = /^\$2[ayb]\$[0-9]{2}\$.{53}$/.test(hashedPassword);

    if (!isHashed) {
      // La contraseña almacenada no está hasheada, realizar una comparación directa
      return plainTextPassword === hashedPassword;
    }

    // La contraseña almacenada está hasheada, utilizar bcrypt para compararlas
    return bcrypt.compare(plainTextPassword, hashedPassword);
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }
}
