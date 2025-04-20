import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Status } from 'src/common/constants';

export class CreateCategoryDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsEnum(Status)
  status?: Status = Status.activo;
}
