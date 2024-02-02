import { Column, Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'DsUsuari',
  collate: 'Modern_Spanish_CI_AS',
  schema: 'dbo',
  timestamps: false,
})
export class MedikenUser extends Model {
  @Column({ field: 'Dsusucod', primaryKey: true, allowNull: false })
  codigoUsuario: string;

  @Column({ field: 'Dsusunom', allowNull: true })
  nombres: string;

  @Column({ field: 'DsUsustaac', allowNull: true })
  nose1: string;

  @Column({ field: 'Dsusutip', allowNull: true })
  tipo: string;

  @Column({ field: 'Dsusucla', allowNull: true })
  clave: string;

  @Column({ field: 'Dsusuemail', allowNull: true })
  email: string;

  @Column({ field: 'Dsusunotifchngpass1', allowNull: true })
  notifChangePass1: boolean;

  @Column({ field: 'Dsusunotifchngpass2', allowNull: true })
  notifChangePass2: boolean;

  @Column({ field: 'Dsusunotifchngpass3', allowNull: true })
  notifChangePass3: boolean;

  @Column({ field: 'Dsusunotifchngpassdate1', allowNull: true })
  notifChangePassDate1: Date;

  @Column({ field: 'Dsusunotifchngpassdate2', allowNull: true })
  notifChangePassDate2: Date;

  @Column({ field: 'Dsusunotifchngpassdate3', allowNull: true })
  notifChangePassDate3: Date;

  @Column({ field: 'Dsusuimg', allowNull: true })
  img: Buffer;

  @Column({ field: 'Dsusuide', allowNull: true })
  usuario: string;
}
