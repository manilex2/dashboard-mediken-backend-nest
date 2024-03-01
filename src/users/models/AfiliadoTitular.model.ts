import { Column, Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'RgmClie',
  collate: 'Modern_Spanish_CI_AS',
  schema: 'dbo',
  timestamps: false,
})
export class AfiliadoTitular extends Model {
  @Column({ field: 'ClRgide', primaryKey: true, allowNull: false })
  usuario: string;

  @Column({ field: 'ClRgcnt', primaryKey: true, allowNull: false })
  contrato: string;

  @Column({ field: 'ClRgcnsc', primaryKey: true, allowNull: false })
  secuencial: string;

  @Column({ field: 'ClRgnom', allowNull: true })
  nombres: string;

  @Column({ field: 'ClRgape', allowNull: true })
  apellidos: string;

  @Column({ field: 'ClRgcnso', allowNull: true })
  solicitud: string;

  @Column({ field: 'ClRgSta', allowNull: true })
  statusCliente: string;

  @Column({ field: 'ClRgfcUA', allowNull: true })
  fechaUltAct: Date;

  @Column({ field: 'ClRgIdUA', allowNull: true })
  nose1: string;

  @Column({ field: 'ClRgHrUA', allowNull: true })
  horaUltAct: string;

  @Column({ field: 'ClRgTTpCt', allowNull: true })
  tipoCuenta: string;

  @Column({ field: 'ClRgTNum', allowNull: true })
  nose2: string;

  @Column({ field: 'ClRgTNom', allowNull: true })
  nose3: string;

  @Column({ field: 'ClRgTIde', allowNull: true })
  identificacion: string;

  @Column({ field: 'ClRgfeclog', allowNull: true })
  fechaLog: Date;

  @Column({ field: 'ClRgSus', allowNull: true })
  suspendido: string;

  @Column({ field: 'RgmBco', allowNull: true })
  codBanco: string;

  @Column({ field: 'ClRgFnum', allowNull: true })
  nose4: string;

  @Column({ field: 'ClRgFdir', allowNull: true })
  direccion: string;

  @Column({ field: 'ClRgFema', allowNull: true })
  email: string;

  @Column({ field: 'ClRgofi', allowNull: true })
  oficina: string;

  @Column({ field: 'ClRgBrok', allowNull: true })
  emailBroker: string;

  @Column({ field: 'ClRgcon', allowNull: true })
  clave: string;

  @Column({ field: 'ClRgnotifchngpass1', allowNull: true })
  notifChangePass1: boolean;

  @Column({ field: 'ClRgnotifchngpass2', allowNull: true })
  notifChangePass2: boolean;

  @Column({ field: 'ClRgnotifchngpass3', allowNull: true })
  notifChangePass3: boolean;

  @Column({ field: 'ClRgnotifchngpassdate1', allowNull: true })
  notifChangePassDate1: string;

  @Column({ field: 'ClRgnotifchngpassdate2', allowNull: true })
  notifChangePassDate2: string;

  @Column({ field: 'ClRgnotifchngpassdate3', allowNull: true })
  notifChangePassDate3: string;

  @Column({ field: 'ClRgimg', allowNull: true })
  img: Buffer;

  @Column({ field: 'ClRgtokenresetpass', allowNull: true })
  tokenReset: string;

  @Column({ field: 'ClRgtokenresetpassdate', allowNull: true })
  tokenResetDate: string;

  @Column({ field: 'ClRgfirstlogin', allowNull: true })
  firstLogin: boolean;
}
