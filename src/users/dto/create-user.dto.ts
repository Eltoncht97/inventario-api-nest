import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  MinLength,
  IsOptional,
} from 'class-validator';
import { Role, Status } from 'src/common/constants';

export class CreateUserDto {
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  name: string;

  @IsNotEmpty({ message: 'El apellido es obligatorio' })
  lastname: string;

  @IsNotEmpty({ message: 'El nombre de usuario es obligatorio' })
  username: string;

  @IsEmail({}, { message: 'Debe ser un email válido' })
  email: string;

  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @IsEnum(Role, { message: 'Rol inválido' })
  @IsOptional()
  role?: Role;

  @IsEnum(Status, { message: 'Estado inválido' })
  @IsOptional()
  status?: Status;
}
