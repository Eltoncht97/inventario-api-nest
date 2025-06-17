import { Type } from "class-transformer";
import { IsOptional, IsPositive } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class PaginationDto {
  @ApiPropertyOptional({
    example: 1,
    description: "Número de página a consultar (empezando en 1)",
  })
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  page?: number;

  @ApiPropertyOptional({
    example: 10,
    description: "Cantidad de elementos por página",
  })
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  limit?: number;
}
