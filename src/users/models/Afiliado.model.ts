import { Column, Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'Afiliado',
  collate: 'Modern_Spanish_CI_AS',
  schema: 'dbo',
  timestamps: false,
})
export class Afiliado extends Model {
  @Column({ field: 'AfiCnt', primaryKey: true, allowNull: false })
  contrato: string;

  @Column({ field: 'AfiCntSec', primaryKey: true, allowNull: false })
  contratoSec: string;

  @Column({ field: 'AfiBenSec', primaryKey: true, allowNull: false })
  contratoSecBen: string;

  @Column({ field: 'AfiIde', allowNull: true })
  identificacion: string;

  @Column({ field: 'AfiTipo', allowNull: true })
  tipo: string;

  @Column({ field: 'AfiApe', allowNull: true })
  apellido: string;

  @Column({ field: 'AfiNom', allowNull: true })
  nombre: string;

  @Column({ field: 'AfiSol', allowNull: true })
  nose1: string;

  @Column({ field: 'AfiCon', allowNull: true })
  clave: string;

  @Column({ field: 'Afifec', allowNull: true })
  fecha: string;

  @Column({ field: 'AfiSta', allowNull: true })
  nose2: string;

  @Column({ field: 'Afinotifchngpass1', allowNull: true })
  notifChangePass1: boolean;

  @Column({ field: 'Afinotifchngpass2', allowNull: true })
  notifChangePass2: boolean;

  @Column({ field: 'Afinotifchngpass3', allowNull: true })
  notifChangePass3: boolean;

  @Column({ field: 'Afinotifchngpassdate1', allowNull: true })
  notifChangePassDate1: Date;

  @Column({ field: 'Afinotifchngpassdate2', allowNull: true })
  notifChangePassDate2: Date;

  @Column({ field: 'Afinotifchngpassdate3', allowNull: true })
  notifChangePassDate3: Date;

  @Column({ field: 'Afiimg', allowNull: true })
  img: Buffer;
}
