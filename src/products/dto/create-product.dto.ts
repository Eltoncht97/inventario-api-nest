import {
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  IsUUID,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IvaType, Status } from 'src/common/constants';

export class CreateProductDto {
  @IsString()
  code: string;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  stock: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  stockMin: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  cost: number;

  @IsEnum(IvaType)
  ivaType: IvaType;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  ivaValue: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  costTotal: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  discountPercent: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  discountValue: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  utilitiesPercent: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  utilitiesValue: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price: number;

  @IsUUID()
  categoryId: string;

  @IsOptional()
  @IsEnum(Status)
  status?: Status = Status.activo;
}
