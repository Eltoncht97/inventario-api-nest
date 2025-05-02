import {
  IsString,
  IsOptional,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  Length,
} from 'class-validator';
import { DocumentType, Status } from 'src/common/constants';

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'El primer apellido es obligatorio' })
  lastName1: string;

  @IsString()
  @IsOptional()
  lastName2?: string;

  @IsString()
  @IsNotEmpty({ message: 'El documento es obligatorio' })
  @Length(6, 20, { message: 'El documento debe tener entre 6 y 20 caracteres' })
  document: string;

  @IsEnum(DocumentType, {
    message: `Tipo de documento inválido. Valores permitidos: ${Object.values(DocumentType).join(', ')}`,
  })
  @IsOptional() // por si querés que default = DNI se aplique desde el modelo
  documentType?: DocumentType;

  @IsOptional()
  @IsEmail({}, { message: 'El email no es válido' })
  email?: string;

  @IsString()
  @IsNotEmpty({ message: 'El teléfono es obligatorio' })
  phone: string;

  @IsString()
  @IsNotEmpty({ message: 'La dirección es obligatoria' })
  address: string;

  @IsEnum(Status)
  @IsOptional() // si querés que por defecto se guarde como "activo"
  status?: Status;
}
