import { Column, Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'Dsbroker',
  collate: 'Modern_Spanish_CI_AS',
  schema: 'dbo',
  timestamps: false,
})
export class Broker extends Model {
  @Column({ field: 'dsvccod', primaryKey: true, allowNull: false })
  codigoBrokerComp: string;

  @Column({ field: 'dsvcnom', allowNull: true })
  nombres: string;

  @Column({ field: 'dsvcsta', allowNull: true })
  statusBroker: string;

  @Column({ field: 'dsvcruc', allowNull: true })
  ruc: string;

  @Column({ field: 'dsvcrple', allowNull: true })
  representanteLegal: string;

  @Column({ field: 'dsvcema', allowNull: true })
  email: string;

  @Column({ field: 'dsvccon', allowNull: true })
  clave: string;

  @Column({ field: 'dsvcnotifchngpass1', allowNull: true })
  notifChangePass1: boolean;

  @Column({ field: 'dsvcnotifchngpass2', allowNull: true })
  notifChangePass2: boolean;

  @Column({ field: 'dsvcnotifchngpass3', allowNull: true })
  notifChangePass3: boolean;

  @Column({ field: 'dsvcnotifchngpassdate1', allowNull: true })
  notifChangePassDate1: string;

  @Column({ field: 'dsvcnotifchngpassdate2', allowNull: true })
  notifChangePassDate2: string;

  @Column({ field: 'dsvcnotifchngpassdate3', allowNull: true })
  notifChangePassDate3: string;

  @Column({ field: 'dsvcimg', allowNull: true })
  img: Buffer;

  @Column({ field: 'dsvcide', allowNull: true })
  usuario: string;

  @Column({ field: 'dsvctokenresetpass', allowNull: true })
  tokenReset: string;

  @Column({ field: 'dsvctokenresetpassdate', allowNull: true })
  tokenResetDate: string;

  @Column({ field: 'dsvcfirstlogin', allowNull: true })
  firstLogin: boolean;
}
