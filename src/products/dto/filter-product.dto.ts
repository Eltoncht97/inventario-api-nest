import { PaginationDto } from 'src/common/dto/pagination.dto';
import { IsOptional, IsUUID, IsEnum } from 'class-validator';
import { Status } from '@prisma/client';

export class FilterProductDto extends PaginationDto {
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsEnum(Status)
  status?: Status;
}
