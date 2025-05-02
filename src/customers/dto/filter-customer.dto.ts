import { PaginationDto } from 'src/common/dto/pagination.dto';
import { IsOptional, IsEnum } from 'class-validator';
import { Status } from '@prisma/client';

export class FilterCustomerDto extends PaginationDto {
  @IsOptional()
  @IsEnum(Status)
  status?: Status;
}
