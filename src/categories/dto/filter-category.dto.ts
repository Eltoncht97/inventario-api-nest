import { IsOptional, IsEnum } from 'class-validator';
import { Status } from 'src/common/constants';
import { PaginationDto } from 'src/common/dto/pagination.dto';

export class FilterCategoryDto extends PaginationDto {
  @IsOptional()
  @IsEnum(Status)
  status?: Status;
}
