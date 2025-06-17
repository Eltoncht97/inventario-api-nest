import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString } from "class-validator";
import { Status } from "src/common/constants";

export class CreateCategoryDto {
  @ApiProperty({
    example: "Electrónica",
    description: "Nombre de la categoría",
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: "activo",
    enum: Status,
    description: "Estado de la categoría: activo o inactivo",
    default: Status.activo,
    required: false,
  })
  @IsOptional()
  @IsEnum(Status)
  status?: Status = Status.activo;
}
