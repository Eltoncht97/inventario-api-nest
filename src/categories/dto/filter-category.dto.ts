import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional } from "class-validator";
import { Status } from "src/common/constants";
import { PaginationDto } from "src/common/dto/pagination.dto";

export class FilterCategoryDto extends PaginationDto {
  @ApiProperty({
    example: "activo",
    enum: Status,
    description: "Estado de la categoría: activo o inactivo",
    default: Status.activo,
    required: false,
  })
  @IsOptional()
  @IsEnum(Status)
  status?: Status;
}
