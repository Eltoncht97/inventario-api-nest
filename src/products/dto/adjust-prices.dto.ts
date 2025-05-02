import { IsNumber, IsOptional, IsUUID, Min } from 'class-validator';

export class AdjustPricesDto {
  @IsNumber()
  @Min(0)
  percentToAdd: number;

  @IsOptional()
  @IsUUID()
  categoryId?: string;
}
