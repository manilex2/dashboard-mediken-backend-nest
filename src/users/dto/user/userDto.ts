export class UserDto {
  usuario: string;
  clave: string;
  tokenReset?: string;
  nuevaClave?: string;
  email?: string;
  token?: string;
  img?: Buffer;
  nuevoUsuario?: string;
  noNewPass?: boolean;
}
