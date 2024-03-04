import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserDto } from './dto/user/userDTO';
import { InjectModel } from '@nestjs/sequelize';
import { MedikenUser, Beneficiario, Broker, AfiliadoTitular } from './models';
import * as bcrypt from 'bcrypt';
import { DateTime } from 'luxon';
import { Op } from 'sequelize';

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
    let claveHash: string;
    try {
      user = await this.medikenUser.findOne({
        where: {
          [Op.or]: [{ usuario: id }, { codigoUsuario: id }],
        },
      });
      if (user) {
        claveHash = await this.hashPassword(data.clave);
        user.clave = claveHash;
        if (data.email && data.email != user.dataValues.email) {
          user.email = data.email;
        }
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
        user = await this.broker.findOne({
          where: {
            [Op.or]: [{ usuario: id }, { codigoBrokerComp: id }],
          },
        });
        if (user) {
          claveHash = await this.hashPassword(data.clave);
          user.clave = claveHash;
          if (data.email && data.email != user.dataValues.email) {
            user.email = data.email;
          }
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
          user = await this.afiliadoTitular.findOne({
            where: {
              usuario: id,
            },
          });
          if (user) {
            claveHash = await this.hashPassword(data.clave);
            user.clave = claveHash;
            if (data.email && data.email != user.dataValues.email) {
              user.email = data.email;
            }
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
            user = await this.beneficiario.findOne({
              where: {
                usuario: id,
              },
            });
            if (user) {
              claveHash = await this.hashPassword(data.clave);
              user.clave = claveHash;
              if (data.email && data.email != user.dataValues.email) {
                user.email = data.email;
              }
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

  async updateFirstLogin(
    id: string,
    data: UserDto,
  ): Promise<MedikenUser | Broker | AfiliadoTitular | Beneficiario> {
    let user: MedikenUser | Broker | Beneficiario | AfiliadoTitular;
    let claveHash: string;
    try {
      user = await this.medikenUser.findOne({
        where: {
          [Op.or]: [{ usuario: id }, { codigoUsuario: id }],
        },
      });
      if (user) {
        user.usuario = data.nuevoUsuario;
        user.email = data.email;
        if (data.clave) {
          claveHash = await this.hashPassword(data.clave);
          user.clave = claveHash;
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
        }
        if (data.img) {
          user.img = data.img;
        }
        user.firstLogin = false;
        user = await user.save();
        return user;
      } else {
        user = await this.broker.findOne({
          where: {
            [Op.or]: [{ usuario: id }, { codigoBrokerComp: id }],
          },
        });
        if (user) {
          user.usuario = data.nuevoUsuario;
          user.email = data.email;
          if (data.clave) {
            claveHash = await this.hashPassword(data.clave);
            user.clave = claveHash;
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
          }
          if (data.img) {
            user.img = data.img;
          }
          user.firstLogin = false;
          user = await user.save();
          return user;
        } else {
          user = await this.afiliadoTitular.findOne({
            where: {
              usuario: id,
            },
          });
          if (user) {
            user.usuario = data.nuevoUsuario;
            user.email = data.email;
            if (data.clave) {
              claveHash = await this.hashPassword(data.clave);
              user.clave = claveHash;
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
            }
            if (data.img) {
              user.img = data.img;
            }
            user.firstLogin = false;
            user = await user.save();
            return user;
          } else {
            user = await this.beneficiario.findOne({
              where: {
                usuario: id,
              },
            });
            if (user) {
              user.usuario = data.nuevoUsuario;
              user.email = data.email;
              if (data.clave) {
                claveHash = await this.hashPassword(data.clave);
                user.clave = claveHash;
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
              }
              if (data.img) {
                user.img = data.img;
              }
              user.firstLogin = false;
              user = await user.save();
              return user;
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
          [Op.or]: [{ usuario: id }, { codigoUsuario: id }],
        },
      });
      if (user) {
        user.img = data;
        user = await user.save();
        const imgBuffer: Buffer = user.dataValues.img;
        const imgBase64 = imgBuffer.toString('base64');
        return {
          img: imgBase64,
        };
      } else {
        user = await this.broker.findOne({
          where: {
            [Op.or]: [{ usuario: id }, { codigoBrokerComp: id }],
          },
        });
        if (user) {
          user.img = data;
          user = await user.save();
          const imgBuffer: Buffer = user.dataValues.img;
          const imgBase64 = imgBuffer.toString('base64');
          return {
            img: imgBase64,
          };
        } else {
          user = await this.afiliadoTitular.findOne({
            where: {
              usuario: id,
            },
          });
          if (user) {
            user.img = data;
            user = await user.save();
            const imgBuffer: Buffer = user.dataValues.img;
            const imgBase64 = imgBuffer.toString('base64');
            return {
              img: imgBase64,
            };
          } else {
            user = await this.beneficiario.findOne({
              where: {
                usuario: id,
              },
            });
            if (user) {
              user.img = data;
              user = await user.save();
              const imgBuffer: Buffer = user.dataValues.img;
              const imgBase64 = imgBuffer.toString('base64');
              return {
                img: imgBase64,
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
          [Op.or]: [{ usuario: id }, { codigoUsuario: id }],
        },
      });
      if (user && (await user).dataValues.img) {
        const imgBuffer: Buffer = (await user).dataValues.img;
        const imgBase64 = imgBuffer.toString('base64');
        return {
          img: imgBase64,
        };
      } else {
        user = this.broker.findOne({
          where: {
            [Op.or]: [{ usuario: id }, { codigoBrokerComp: id }],
          },
        });
        if (user && (await user).dataValues.img) {
          const imgBuffer: Buffer = (await user).dataValues.img;
          const imgBase64 = imgBuffer.toString('base64');
          return {
            img: imgBase64,
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
              img: imgBase64,
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
                img: imgBase64,
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
