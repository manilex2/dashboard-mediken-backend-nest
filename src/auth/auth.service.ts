import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from '../users/dto/user/userDTO';
import { InjectModel } from '@nestjs/sequelize';
import { Afiliado, Beneficiario, Broker, MedikenUser } from 'src/users/models';
import * as bcrypt from 'bcrypt';
import { google } from 'googleapis';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { Options } from 'nodemailer/lib/smtp-transport';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(MedikenUser)
    private readonly medikenUser: typeof MedikenUser,
    @InjectModel(Beneficiario)
    private readonly beneficiario: typeof MedikenUser,
    @InjectModel(Broker)
    private readonly broker: typeof Broker,
    @InjectModel(Afiliado)
    private readonly afiliado: typeof Afiliado,
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  async login(
    user: Promise<MedikenUser | Beneficiario | Broker>,
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
  ): Promise<MedikenUser | Broker | Beneficiario | Afiliado> {
    let user: MedikenUser | Broker | Beneficiario | Afiliado;
    try {
      user = await this.medikenUser.findOne({
        where: {
          usuario: data.usuario,
        },
        attributes: {
          exclude: ['Dsusuimg'],
        },
      });
      if (user) {
        const passwordMatch = await this.comparePasswords(
          data.clave.trim(),
          user.dataValues.clave.trim(),
        );
        if (passwordMatch) {
          user.dataValues.usuario = user.dataValues.usuario.trim();
          delete user.dataValues.clave;
          user.dataValues.tipoUsuario = 'Mediken';
          return user;
        } else {
          throw new HttpException(
            'Usuario no autorizado. Verifique usuario y contraseña',
            HttpStatus.FORBIDDEN,
          );
        }
      } else {
        user = await this.broker.findOne({
          where: {
            usuario: data.usuario,
          },
          attributes: {
            exclude: ['dsvcimg'],
          },
        });
        if (user) {
          const passwordMatch = await this.comparePasswords(
            data.clave.trim(),
            user.dataValues.clave.trim(),
          );
          if (passwordMatch) {
            user.dataValues.usuario = user.dataValues.usuario.trim();
            delete user.dataValues.clave;
            user.dataValues.tipoUsuario = 'Broker';
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
            attributes: {
              exclude: ['beveimg'],
            },
          });
          if (user) {
            const passwordMatch = await this.comparePasswords(
              data.clave.trim(),
              user.dataValues.clave.trim(),
            );
            if (passwordMatch) {
              user.dataValues.usuario = user.dataValues.usuario.trim();
              delete user.dataValues.clave;
              user.dataValues.tipoUsuario = 'Beneficiario';
              return user;
            } else {
              throw new HttpException(
                'Usuario no autorizado. Verifique usuario y contraseña',
                HttpStatus.FORBIDDEN,
              );
            }
          } else {
            user = await this.afiliado.findOne({
              where: {
                usuario: data.usuario,
              },
              attributes: {
                exclude: ['Afiimg'],
              },
            });
            if (user) {
              const passwordMatch = await this.comparePasswords(
                data.clave.trim(),
                user.dataValues.clave.trim(),
              );
              if (passwordMatch) {
                user.dataValues.usuario = user.dataValues.usuario.trim();
                delete user.dataValues.clave;
                user.dataValues.tipoUsuario = 'Afiliado';
                return user;
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

  async resetPassword(userDto: UserDto): Promise<object> {
    try {
      const oAuth2Client = new google.auth.OAuth2(
        this.configService.get<string>('gmail.clientId'),
        this.configService.get<string>('gmail.secret'),
        'https://developers.google.com/oauthplayground',
      );

      oAuth2Client.setCredentials({
        refresh_token: this.configService.get<string>('gmail.refreshToken'),
      });

      const ACCESS_TOKEN: string = await this.obtenerTokenAcceso(oAuth2Client);
      const config: Options = {
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
          type: 'OAuth2',
          user: this.configService.get<string>('gmail.user'),
          clientId: this.configService.get<string>('gmail.clientId'),
          clientSecret: this.configService.get<string>('gmail.secret'),
          refreshToken: this.configService.get<string>('gmail.refreshToken'),
          accessToken: ACCESS_TOKEN,
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
          to: 'manilex2@gmail.com',
          subject: 'SOLICITUD DE RESETEO DE CONTRASEÑA',
          template: 'index',
          context: {
            email: userDto.email,
            urlPwd: this.configService.get<string>('origin_url'),
          },
          attachments: [
            {
              filename: 'mediken.png',
              path: `${process.cwd()}/assets/mediken.png`,
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
      return userDto;
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async obtenerTokenAcceso(oAuth2Client: any): Promise<string> {
    const tokenInfo = await oAuth2Client.getAccessToken();
    // Verificar si el token está próximo a expirar (por ejemplo, en los próximos 5 minutos)
    if (tokenInfo.expiry_date - Date.now() < 5 * 60 * 1000) {
      // Refrescar el token si está próximo a expirar
      const newTokenInfo = await oAuth2Client.refreshAccessToken();
      return newTokenInfo.token;
    }
    return tokenInfo.token;
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
}
