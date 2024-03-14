import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from '../users/dto/user/userDto';
import { InjectModel } from '@nestjs/sequelize';
import {
  AfiliadoTitular,
  Beneficiario,
  Broker,
  MedikenUser,
} from '../users/models';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { Options } from 'nodemailer/lib/smtp-transport';
import { Op } from 'sequelize';
import { readFile } from 'fs/promises';
import * as crypto from 'crypto-js';
import { DateTime } from 'luxon';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(MedikenUser)
    private readonly medikenUser: typeof MedikenUser,
    @InjectModel(Beneficiario)
    private readonly beneficiario: typeof Beneficiario,
    @InjectModel(Broker)
    private readonly broker: typeof Broker,
    @InjectModel(AfiliadoTitular)
    private readonly afiliadoTitular: typeof AfiliadoTitular,
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  async login(
    user: Promise<MedikenUser | Beneficiario | Broker | AfiliadoTitular>,
  ): Promise<object> {
    return {
      token: this.jwtService.sign({
        user: {
          ...user,
        },
      }),
    };
  }

  async getUser(
    data: UserDto,
  ): Promise<MedikenUser | Broker | Beneficiario | AfiliadoTitular> {
    let user: MedikenUser | Broker | Beneficiario | AfiliadoTitular;
    try {
      // TODO: Eliminar OR de codigoUsuario
      user = await this.medikenUser.findOne({
        where: {
          [Op.or]: [{ usuario: data.usuario }, { codigoUsuario: data.usuario }],
        },
      });
      if (user) {
        let passwordMatch = await this.comparePasswords(
          data.clave.trim(),
          user.dataValues.clave.trim(),
        );
        if (!passwordMatch && data.noNewPass) {
          passwordMatch = true;
        }
        if (passwordMatch) {
          // TODO: Eliminar asignacion de codigoUsuario como usuario
          user.dataValues.usuario = user.dataValues.usuario
            ? user.dataValues.usuario.trim()
            : user.dataValues.codigoUsuario.trim();
          delete user.dataValues.clave;
          delete user.dataValues.img;
          user.dataValues.email = user.dataValues.email
            ? user.dataValues.email.trim()
            : null;
          user.dataValues.tipoUsuario = 'Mediken';
          return user;
        } else {
          throw new HttpException(
            'Usuario no autorizado. Verifique usuario y contraseña',
            HttpStatus.FORBIDDEN,
          );
        }
      } else {
        // TODO: Eliminar OR de codigoBrokerComp
        user = await this.broker.findOne({
          where: {
            [Op.or]: [
              { usuario: data.usuario },
              { codigoBrokerComp: data.usuario },
            ],
          },
        });
        if (user) {
          let passwordMatch = await this.comparePasswords(
            data.clave.trim(),
            user.dataValues.clave.trim(),
          );
          if (!passwordMatch && data.noNewPass) {
            passwordMatch = true;
          }
          if (passwordMatch) {
            // TODO: Eliminar asignacion de codigoBrokerComp como usuario
            user.dataValues.usuario = user.dataValues.usuario
              ? user.dataValues.usuario.trim()
              : user.dataValues.codigoBrokerComp.trim();
            delete user.dataValues.clave;
            delete user.dataValues.img;
            user.dataValues.email = user.dataValues.email
              ? user.dataValues.email.trim()
              : null;
            user.dataValues.tipoUsuario = 'Broker';
            return user;
          } else {
            throw new HttpException(
              'Usuario no autorizado. Verifique usuario y contraseña',
              HttpStatus.FORBIDDEN,
            );
          }
        } else {
          user = await this.afiliadoTitular.findOne({
            where: {
              usuario: data.usuario,
            },
          });
          if (user) {
            let passwordMatch = await this.comparePasswords(
              data.clave.trim(),
              user.dataValues.clave.trim(),
            );
            if (!passwordMatch && data.noNewPass) {
              passwordMatch = true;
            }
            if (passwordMatch) {
              user.dataValues.usuario = user.dataValues.usuario.trim();
              delete user.dataValues.clave;
              delete user.dataValues.img;
              user.dataValues.tipoUsuario = 'AfiliadoTitular';
              user.dataValues.email = user.dataValues.email
                ? user.dataValues.email.trim()
                : null;
              const contratos = await this.afiliadoTitular.findAll({
                where: {
                  usuario: data.usuario,
                },
                attributes: [
                  ['ClRgcnt', 'contrato'],
                  ['ClRgcnsc', 'secuencial'],
                ],
              });
              delete user.dataValues.contrato;
              user.dataValues.contratos = [];
              for (let i = 0; i < contratos.length; i++) {
                const contrato = contratos[i];
                const benef = await this.beneficiario.findAll({
                  where: {
                    contrato: contrato.contrato,
                  },
                  attributes: [
                    ['beveIde', 'id'],
                    ['bevenom', 'nombres'],
                    ['beveape', 'apellidos'],
                    ['bevecnt', 'contrato'],
                    ['bevecntsec', 'secuencialContrato'],
                    ['bevebensec', 'secuencialBeneficiario'],
                  ],
                });
                user.dataValues.contratos.push({
                  contrato: contrato.dataValues.contrato,
                  secuencial: contrato.dataValues.secuencial,
                  beneficiarios: benef,
                });
              }
              return user;
            } else {
              throw new HttpException(
                'Usuario no autorizado. Verifique usuario y contraseña',
                HttpStatus.FORBIDDEN,
              );
            }
          } else {
            user = await this.beneficiario.findOne({
              where: {
                usuario: data.usuario,
              },
            });
            if (user) {
              let passwordMatch = await this.comparePasswords(
                data.clave.trim(),
                user.dataValues.clave.trim(),
              );
              if (!passwordMatch && data.noNewPass) {
                passwordMatch = true;
              }
              if (passwordMatch) {
                user.dataValues.usuario = user.dataValues.usuario.trim();
                delete user.dataValues.clave;
                delete user.dataValues.img;
                user.dataValues.tipoUsuario = 'Beneficiario';
                user.dataValues.email = user.dataValues.email
                  ? user.dataValues.email.trim()
                  : null;
                return user;
              } else {
                throw new HttpException(
                  'Usuario no autorizado. Verifique usuario y contraseña',
                  HttpStatus.FORBIDDEN,
                );
              }
            } else {
              throw new HttpException(
                'Usuario no autorizado. Verifique usuario y contraseña',
                HttpStatus.FORBIDDEN,
              );
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

  async resetPassword(data: UserDto): Promise<object> {
    let user: MedikenUser | Broker | Beneficiario | AfiliadoTitular;
    let token: string;
    try {
      user = await this.medikenUser.findOne({
        where: {
          [Op.or]: [{ usuario: data.email }, { email: data.email }],
        },
        attributes: [
          ['Dsusuemail', 'email'],
          ['Dsusucod', 'codigoUsuario'],
          ['Dsusuide', 'usuario'],
        ],
      });
      if (user) {
        if (!user.dataValues.email) {
          throw new HttpException(
            'Lo siento, no hay un email asociado a este usuario, por favor contacte al administrador.',
            HttpStatus.FORBIDDEN,
          );
        }
        token = await this.generateToken();
        user.tokenReset = token;
        user.tokenResetDate = DateTime.now()
          .setLocale('es-ec')
          .toISO({ includeOffset: false });
        user = await user.save();
      } else {
        user = await this.broker.findOne({
          where: {
            [Op.or]: [{ usuario: data.email }, { email: data.email }],
          },
          attributes: [
            ['dsvcema', 'email'],
            ['dsvccod', 'codigoBrokerComp'],
            ['dsvcide', 'usuario'],
          ],
        });
        if (user) {
          if (!user.dataValues.email) {
            throw new HttpException(
              'Lo siento, no hay un email asociado a este usuario, por favor contacte al administrador.',
              HttpStatus.FORBIDDEN,
            );
          }
          token = await this.generateToken();
          user.tokenReset = token;
          user.tokenResetDate = user.tokenResetDate = DateTime.now()
            .setLocale('es-ec')
            .toISO({ includeOffset: false });
          user = await user.save();
        } else {
          user = await this.afiliadoTitular.findOne({
            where: {
              [Op.or]: [{ usuario: data.email }, { email: data.email }],
            },
            attributes: [
              ['ClRgFema', 'email'],
              ['ClRgide', 'usuario'],
              ['ClRgcnt', 'contrato'],
              ['ClRgcnsc', 'secuencial'],
            ],
          });
          if (user) {
            if (!user.dataValues.email) {
              throw new HttpException(
                'Lo siento, no hay un email asociado a este usuario, por favor contacte al administrador.',
                HttpStatus.FORBIDDEN,
              );
            }
            token = await this.generateToken();
            user.tokenReset = token;
            user.tokenResetDate = DateTime.now()
              .setLocale('es-ec')
              .toISO({ includeOffset: false });
            user = await user.save();
          } else {
            user = await this.beneficiario.findOne({
              where: {
                [Op.or]: [{ usuario: data.email }, { email: data.email }],
              },
              attributes: [
                ['beveema', 'email'],
                ['beveIde', 'usuario'],
              ],
            });
            if (user) {
              if (!user.dataValues.email) {
                throw new HttpException(
                  'Lo siento, no hay un email asociado a este usuario, por favor contacte al administrador.',
                  HttpStatus.FORBIDDEN,
                );
              }
              token = await this.generateToken();
              user.tokenReset = token;
              user.tokenResetDate = DateTime.now()
                .setLocale('es-ec')
                .toISO({ includeOffset: false });
              user = await user.save();
            } else {
              throw new HttpException(
                'Email o Usuario no existe. Verifique su email o usuario e intente de nuevo o ponganse en contacto con el administrador',
                HttpStatus.FORBIDDEN,
              );
            }
          }
        }
      }

      const key = await this.readJsonFile(
        `${process.cwd()}/config/google.json`,
      ).then((data) => {
        return data;
      });

      const config: Options = {
        service: 'gmail',
        host: 'gmail-smtp-in.l.google.com',
        auth: {
          type: 'OAuth2',
          user: this.configService.get<string>('user'),
          serviceClient: key.client_id,
          privateKey: key.private_key,
        },
        tls: {
          rejectUnauthorized: true,
        },
        secure: true,
      };
      this.mailerService.addTransporter('gmail', config);
      await this.mailerService
        .sendMail({
          transporterName: 'gmail',
          to: user.email,
          subject: 'SOLICITUD DE RESETEO DE CONTRASEÑA',
          template: 'index',
          context: {
            email: user.email.trim() || '',
            urlPwd: this.configService.get<string>('origin_url'),
            token: user.tokenReset || '',
            usuario: user.usuario ? user.usuario.trim() : '',
          },
          attachments: [
            {
              filename: 'mediken.png',
              path: `${process.cwd()}/src/assets/mediken.png`,
              cid: 'mediken',
            },
          ],
        })
        .then((success) => {
          console.log(success);
        })
        .catch((err) => {
          console.error(err);
          throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
        });
      return {
        status: 200,
        message: 'Se envió un correo para el reseteo de contraseña',
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async changePasswordReset(data: UserDto): Promise<object> {
    let user: MedikenUser | Broker | Beneficiario | AfiliadoTitular;
    let claveHash: string;
    try {
      user = await this.medikenUser.findOne({
        where: {
          tokenReset: data.token,
          [Op.or]: [{ usuario: data.usuario }, { email: data.email }],
        },
        attributes: {
          exclude: ['Dsusuimg'],
        },
      });
      if (user) {
        const initDate = DateTime.fromJSDate(
          user.dataValues.tokenResetDate,
        ).setZone('UTC');
        const expireDate = DateTime.now().setZone('UTC', {
          keepLocalTime: true,
        });
        if (expireDate.diff(initDate, ['minutes']).toObject().minutes <= 60) {
          claveHash = await this.hashPassword(data.nuevaClave);
          user.clave = claveHash;
          user.tokenReset = null;
          user.tokenResetDate = null;
          if (!user.dataValues.notifChangePass1) {
            user.notifChangePass1 = true;
          }
          if (!user.dataValues.notifChangePass2) {
            user.notifChangePass2 = true;
          }
          if (!user.dataValues.notifChangePass3) {
            user.notifChangePass3 = true;
          }
          if (!user.dataValues.notifChangePassDate1) {
            user.notifChangePassDate1 = DateTime.now().toISO({
              includeOffset: false,
            });
          }
          if (!user.dataValues.notifChangePassDate2) {
            user.notifChangePassDate2 = DateTime.now().toISO({
              includeOffset: false,
            });
          }
          if (!user.dataValues.notifChangePassDate3) {
            user.notifChangePassDate3 = DateTime.now().toISO({
              includeOffset: false,
            });
          }
          user = await user.save();
          return {
            status: 200,
            message: 'Contraseña cambiada exitosamente',
          };
        } else {
          throw new HttpException(
            'Su token expiró. Debe reestablecer su contraseña nuevamente.',
            HttpStatus.FORBIDDEN,
          );
        }
      } else {
        user = await this.broker.findOne({
          where: {
            tokenReset: data.token,
            [Op.or]: [{ usuario: data.usuario }, { email: data.email }],
          },
          attributes: {
            exclude: ['dsvcimg'],
          },
        });
        if (user) {
          const initDate = DateTime.fromJSDate(
            user.dataValues.tokenResetDate,
          ).setZone('UTC');
          const expireDate = DateTime.now().setZone('UTC', {
            keepLocalTime: true,
          });
          if (expireDate.diff(initDate, ['minutes']).toObject().minutes <= 60) {
            claveHash = await this.hashPassword(data.nuevaClave);
            user.clave = claveHash;
            user.tokenReset = null;
            user.tokenResetDate = null;
            if (!user.dataValues.notifChangePass1) {
              user.notifChangePass1 = true;
            }
            if (!user.dataValues.notifChangePass2) {
              user.notifChangePass2 = true;
            }
            if (!user.dataValues.notifChangePass3) {
              user.notifChangePass3 = true;
            }
            if (!user.dataValues.notifChangePassDate1) {
              user.notifChangePassDate1 = DateTime.now().toISO({
                includeOffset: false,
              });
            }
            if (!user.dataValues.notifChangePassDate2) {
              user.notifChangePassDate2 = DateTime.now().toISO({
                includeOffset: false,
              });
            }
            if (!user.dataValues.notifChangePassDate3) {
              user.notifChangePassDate3 = DateTime.now().toISO({
                includeOffset: false,
              });
            }
            user = await user.save();
            return {
              status: 200,
              message: 'Contraseña cambiada exitosamente',
            };
          } else {
            throw new HttpException(
              'Su token expiró. Debe reestablecer su contraseña nuevamente.',
              HttpStatus.FORBIDDEN,
            );
          }
        } else {
          user = await this.afiliadoTitular.findOne({
            where: {
              tokenReset: data.token,
              [Op.or]: [{ usuario: data.usuario }, { email: data.email }],
            },
            attributes: {
              exclude: ['Afiimg'],
            },
          });
          if (user) {
            const initDate = DateTime.fromJSDate(
              user.dataValues.tokenResetDate,
            ).setZone('UTC');
            const expireDate = DateTime.now().setZone('UTC', {
              keepLocalTime: true,
            });
            if (
              expireDate.diff(initDate, ['minutes']).toObject().minutes <= 60
            ) {
              claveHash = await this.hashPassword(data.nuevaClave);
              user.clave = claveHash;
              user.tokenReset = null;
              user.tokenResetDate = null;
              if (!user.dataValues.notifChangePass1) {
                user.notifChangePass1 = true;
              }
              if (!user.dataValues.notifChangePass2) {
                user.notifChangePass2 = true;
              }
              if (!user.dataValues.notifChangePass3) {
                user.notifChangePass3 = true;
              }
              if (!user.dataValues.notifChangePassDate1) {
                user.notifChangePassDate1 = DateTime.now().toISO({
                  includeOffset: false,
                });
              }
              if (!user.dataValues.notifChangePassDate2) {
                user.notifChangePassDate2 = DateTime.now().toISO({
                  includeOffset: false,
                });
              }
              if (!user.dataValues.notifChangePassDate3) {
                user.notifChangePassDate3 = DateTime.now().toISO({
                  includeOffset: false,
                });
              }
              user = await user.save();
              return {
                status: 200,
                message: 'Contraseña cambiada exitosamente',
              };
            } else {
              throw new HttpException(
                'Su token expiró. Debe reestablecer su contraseña nuevamente.',
                HttpStatus.FORBIDDEN,
              );
            }
          } else {
            user = await this.beneficiario.findOne({
              where: {
                tokenReset: data.token,
                [Op.or]: [{ usuario: data.usuario }, { email: data.email }],
              },
              attributes: {
                exclude: ['beveimg'],
              },
            });
            if (user) {
              const initDate = DateTime.fromJSDate(
                user.dataValues.tokenResetDate,
              ).setZone('UTC');
              const expireDate = DateTime.now().setZone('UTC', {
                keepLocalTime: true,
              });
              if (
                expireDate.diff(initDate, ['minutes']).toObject().minutes <= 60
              ) {
                claveHash = await this.hashPassword(data.nuevaClave);
                user.clave = claveHash;
                user.tokenReset = null;
                user.tokenResetDate = null;
                if (!user.dataValues.notifChangePass1) {
                  user.notifChangePass1 = true;
                }
                if (!user.dataValues.notifChangePass2) {
                  user.notifChangePass2 = true;
                }
                if (!user.dataValues.notifChangePass3) {
                  user.notifChangePass3 = true;
                }
                if (!user.dataValues.notifChangePassDate1) {
                  user.notifChangePassDate1 = DateTime.now().toISO({
                    includeOffset: false,
                  });
                }
                if (!user.dataValues.notifChangePassDate2) {
                  user.notifChangePassDate2 = DateTime.now().toISO({
                    includeOffset: false,
                  });
                }
                if (!user.dataValues.notifChangePassDate3) {
                  user.notifChangePassDate3 = DateTime.now().toISO({
                    includeOffset: false,
                  });
                }
                user = await user.save();
                return {
                  status: 200,
                  message: 'Contraseña cambiada exitosamente',
                };
              } else {
                throw new HttpException(
                  'Su token expiró. Debe reestablecer su contraseña nuevamente.',
                  HttpStatus.FORBIDDEN,
                );
              }
            } else {
              throw new HttpException(
                'Token ya utilizado. Debe reestablecer nuevamente la contraseña dandole a ¿Olvide mi contraseña?',
                HttpStatus.FORBIDDEN,
              );
            }
          }
        }
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.FORBIDDEN);
    }
    if (user === null) {
      throw new HttpException(
        'Token ya utilizado. Debe reestablecer nuevamente la contraseña dandole a ¿Olvide mi contraseña?',
        HttpStatus.FORBIDDEN,
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
      return plainTextPassword.toString() === hashedPassword.toString();
    }

    // La contraseña almacenada está hasheada, utilizar bcrypt para compararlas
    return bcrypt.compare(plainTextPassword, hashedPassword);
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  async generateToken(length: number = 256): Promise<string> {
    const randomBytes = crypto.lib.WordArray.random(length / 2);
    const timestampBytes = crypto.lib.WordArray.create([Date.now()]);
    const combinedBytes = randomBytes.concat(timestampBytes);
    const hash = crypto.SHA256(combinedBytes).toString(crypto.enc.Hex);
    return hash.slice(0, length);
  }

  async readJsonFile(path): Promise<any> {
    const file = await readFile(path, 'utf8');
    return JSON.parse(file);
  }
}
