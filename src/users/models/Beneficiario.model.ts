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
  nombre: string;

  @Column({ field: 'beveape', allowNull: false })
  apellido: string;

  @Column({ field: 'bevecob', allowNull: false })
  nose1: number;

  @Column({ field: 'bevesalcob', allowNull: false })
  nose2: number;

  @Column({ field: 'bevesus', allowNull: false })
  nose3: string;

  @Column({ field: 'beveven', allowNull: false })
  nose4: string;

  @Column({ field: 'beveexc', allowNull: false })
  nose5: string;

  @Column({ field: 'bevedet', allowNull: false })
  condicion: string;

  @Column({ field: 'beveusrlog', allowNull: false })
  nose6: string;

  @Column({ field: 'bevefeclog', allowNull: false })
  nose7: Date;

  @Column({ field: 'bevehralog', allowNull: false })
  nose8: string;

  @Column({ field: 'bevefecinc', allowNull: false })
  fechaInclu: Date;

  @Column({ field: 'bevefecnac', allowNull: true })
  fechaNac: Date;

  @Column({ field: 'bevecnt', allowNull: true })
  numContrato: string;

  @Column({ field: 'bevecntsec', allowNull: true })
  secuencialContrato: string;

  @Column({ field: 'bevebensec', allowNull: true })
  secuencialBeneficiario: string;

  @Column({ field: 'bevesex', allowNull: true })
  sexo: string;

  @Column({ field: 'bevetip', allowNull: true })
  tipo: string;

  @Column({ field: 'bevecont', allowNull: false })
  clave: string;

  @Column({ field: 'beveema', allowNull: false })
  email: string;

  @Column({ field: 'beveoficod', allowNull: true })
  codOfic: string;

  @Column({ field: 'bevecliid', allowNull: true })
  clientID: string;

  @Column({ field: 'bevenotifchngpass1', allowNull: true })
  notifChangePass1: boolean;

  @Column({ field: 'bevenotifchngpass2', allowNull: true })
  notifChangePass2: boolean;

  @Column({ field: 'bevenotifchngpass3', allowNull: true })
  notifChangePass3: boolean;

  @Column({ field: 'bevenotifchngpassdate1', allowNull: true })
  notifChangePassDate1: Date;

  @Column({ field: 'bevenotifchngpassdate2', allowNull: true })
  notifChangePassDate2: Date;

  @Column({ field: 'bevenotifchngpassdate3', allowNull: true })
  notifChangePassDate3: Date;

  @Column({ field: 'beveimg', allowNull: true })
  img: Buffer;
}
