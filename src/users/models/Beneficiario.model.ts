import { Column, Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'Beneficiarios',
  collate: 'Modern_Spanish_CI_AS',
  schema: 'dbo',
  timestamps: false,
})
export class Beneficiario extends Model {
  @Column({ field: 'beveIde', primaryKey: true, allowNull: false })
  usuario: string;

  @Column({ field: 'bevenom', allowNull: false })
  nombres: string;

  @Column({ field: 'beveape', allowNull: false })
  apellidos: string;

  @Column({ field: 'bevecob', allowNull: false })
  cobertura: number;

  @Column({ field: 'bevesalcob', allowNull: false })
  saldoCobertura: number;

  @Column({ field: 'bevesus', allowNull: false })
  suspendido: string;

  @Column({ field: 'beveven', allowNull: false })
  nose1: string;

  @Column({ field: 'beveexc', allowNull: false })
  statusExcluido: string;

  @Column({ field: 'bevedet', allowNull: false })
  diagnostico: string;

  @Column({ field: 'beveusrlog', allowNull: false })
  usuarioLog: string;

  @Column({ field: 'bevefeclog', allowNull: false })
  fechaLog: Date;

  @Column({ field: 'bevehralog', allowNull: false })
  horaLog: string;

  @Column({ field: 'bevefecinc', allowNull: false })
  fechaInclusion: Date;

  @Column({ field: 'bevefecnac', allowNull: true })
  fechaNacimiento: Date;

  @Column({ field: 'bevecnt', allowNull: true })
  contrato: string;

  @Column({ field: 'bevecntsec', allowNull: true })
  secuencialContrato: string;

  @Column({ field: 'bevebensec', allowNull: true })
  secuencialBeneficiario: string;

  @Column({ field: 'bevesex', allowNull: true })
  genero: string;

  @Column({ field: 'bevetip', allowNull: true })
  tipo: string;

  @Column({ field: 'bevecont', allowNull: false })
  clave: string;

  @Column({ field: 'beveema', allowNull: false })
  email: string;

  @Column({ field: 'beveoficod', allowNull: true })
  oficina: string;

  @Column({ field: 'bevecliid', allowNull: true })
  cedula: string;

  @Column({ field: 'bevenotifchngpass1', allowNull: true })
  notifChangePass1: boolean;

  @Column({ field: 'bevenotifchngpass2', allowNull: true })
  notifChangePass2: boolean;

  @Column({ field: 'bevenotifchngpass3', allowNull: true })
  notifChangePass3: boolean;

  @Column({ field: 'bevenotifchngpassdate1', allowNull: true })
  notifChangePassDate1: string;

  @Column({ field: 'bevenotifchngpassdate2', allowNull: true })
  notifChangePassDate2: string;

  @Column({ field: 'bevenotifchngpassdate3', allowNull: true })
  notifChangePassDate3: string;

  @Column({ field: 'beveimg', allowNull: true })
  img: Buffer;

  @Column({ field: 'bevetokenresetpass', allowNull: true })
  tokenReset: string;

  @Column({ field: 'bevetokenresetpassdate', allowNull: true })
  tokenResetDate: string;
}
