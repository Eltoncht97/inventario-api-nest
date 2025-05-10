import { PaginationDto } from 'src/common/dto/pagination.dto';
import { IsOptional, IsEnum } from 'class-validator';
import { Status } from '@prisma/client';
import { Role } from 'src/common/constants';

export class FilterUserDto extends PaginationDto {
  @IsOptional()
  role?: Role;

  @IsOptional()
  @IsEnum(Status)
  status?: Status;
}
