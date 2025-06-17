import { applyDecorators } from "@nestjs/common";
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from "@nestjs/swagger";
import { CreateCategoryDto } from "src/categories/dto/create-category.dto";
import { UpdateCategoryDto } from "src/categories/dto/update-category.dto";

export function ApiCreateCategory() {
  return applyDecorators(
    ApiOperation({ summary: "Crear una nueva categoría" }),
    ApiResponse({ status: 201, description: "Categoría creada exitosamente" }),
    ApiResponse({ status: 400, description: "Datos inválidos" }),
    ApiBody({ type: CreateCategoryDto }),
  );
}

export function ApiGetAllCategories() {
  return applyDecorators(
    ApiOperation({ summary: "Listar todas las categorías" }),
    ApiResponse({ status: 200, description: "Listado de categorías" }),
    ApiQuery({
      name: "page",
      type: Number,
      required: false,
      description: "Número de página a consultar",
    }),
    ApiQuery({
      name: "limit",
      type: Number,
      required: false,
      description: "Cantidad de elementos por página",
    }),
  );
}

export function ApiGetCategoryById() {
  return applyDecorators(
    ApiOperation({ summary: "Obtener una categoría por ID" }),
    ApiParam({
      name: "id",
      type: String,
      description: "ID de la categoría",
      example: "uuid-1234-5678",
    }),
    ApiResponse({ status: 200, description: "Categoría encontrada" }),
    ApiResponse({ status: 404, description: "No encontrada" }),
  );
}

export function ApiUpdateCategory() {
  return applyDecorators(
    ApiOperation({ summary: "Actualizar una categoría" }),
    ApiParam({
      name: "id",
      type: String,
      description: "ID de la categoría a actualizar",
    }),
    ApiBody({ type: UpdateCategoryDto }),
    ApiResponse({ status: 200, description: "Categoría actualizada" }),
    ApiResponse({ status: 404, description: "No encontrada" }),
  );
}

export function ApiToggleCategoryStatus() {
  return applyDecorators(
    ApiOperation({ summary: "Alternar estado activo/inactivo" }),
    ApiParam({
      name: "id",
      type: String,
      description: "ID de la categoría",
    }),
    ApiResponse({ status: 200, description: "Estado cambiado" }),
    ApiResponse({ status: 404, description: "No encontrada" }),
  );
}

export function ApiDeleteCategory() {
  return applyDecorators(
    ApiOperation({ summary: "Eliminar una categoría por ID" }),
    ApiParam({
      name: "id",
      type: String,
      description: "ID de la categoría a eliminar",
    }),
    ApiResponse({ status: 200, description: "Categoría eliminada" }),
    ApiResponse({ status: 404, description: "No encontrada" }),
  );
}
