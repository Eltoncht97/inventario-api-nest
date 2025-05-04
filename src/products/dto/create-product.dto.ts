import {
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  IsUUID,
  Min,
  Max,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
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

  @Transform(({ value }) => +Number(value).toFixed(2))
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  cost: number;

  @IsEnum(IvaType)
  ivaType: IvaType;

  @IsOptional()
  @Transform(({ value }) => +Number(value).toFixed(2))
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  utilitiesPercent?: number;

  @IsOptional()
  @Transform(({ value }) => +Number(value).toFixed(2))
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  utilitiesValue?: number;

  @IsOptional()
  @Transform(({ value }) => +Number(value).toFixed(2))
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  discountPercent?: number;

  @IsOptional()
  @Transform(({ value }) => +Number(value).toFixed(2))
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  discountValue?: number;

  @IsUUID()
  categoryId: string;

  @IsOptional()
  @IsEnum(Status)
  status?: Status = Status.activo;
}
