import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { CategoriesService } from "./categories.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { FilterCategoryDto } from "./dto/filter-category.dto";
import { Auth } from "src/common/decorators";
import { ApiTags } from "@nestjs/swagger";
import {
  ApiCreateCategory,
  ApiDeleteCategory,
  ApiGetAllCategories,
  ApiGetCategoryById,
  ApiToggleCategoryStatus,
  ApiUpdateCategory,
} from "./decorators/categories-swagger.decorator";

@Auth()
@ApiTags("Categorías")
@Controller("categories")
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiCreateCategory()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @ApiGetAllCategories()
  findAll(@Query() filterDto: FilterCategoryDto) {
    return this.categoriesService.findAll(filterDto);
  }

  @Get(":id")
  @ApiGetCategoryById()
  findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.categoriesService.findOne(id);
  }

  @Patch(":id")
  @ApiUpdateCategory()
  update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Patch(":id/toggle-status")
  @ApiToggleCategoryStatus()
  toggleStatus(@Param("id", ParseUUIDPipe) id: string) {
    return this.categoriesService.toggleStatus(id);
  }

  @Delete(":id")
  @ApiDeleteCategory()
  remove(@Param("id", ParseUUIDPipe) id: string) {
    return this.categoriesService.remove(id);
  }
}
