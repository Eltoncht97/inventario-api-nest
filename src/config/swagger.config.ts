import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
      .setTitle("API Inventario")
      .setDescription("Documentación de la API para el sistema de inventario")
      .setVersion("1.0")
      .build();
  
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api-docs", app, document);
}