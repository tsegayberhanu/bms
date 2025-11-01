import swaggerUi from "swagger-ui-express";
import YAML from "js-yaml";
import type { Express } from "express";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import type { Request, Response, NextFunction } from "express-serve-static-core";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default function setupSwagger(app: Express) {
  const swaggerFilePath = join(__dirname, "../docs/swagger.yaml");

  const loadYaml = (): Record<string, any> => {
    if (!fs.existsSync(swaggerFilePath)) {
      throw new Error(`Swagger file not found at path: ${swaggerFilePath}`);
    }
    const fileContent = fs.readFileSync(swaggerFilePath, "utf8");
    const swaggerDocument = YAML.load(fileContent) as Record<string, any>;
    if (!swaggerDocument) {
      throw new Error("Failed to parse Swagger YAML");
    }
    return swaggerDocument;
  };

  if (process.env.NODE_ENV === "DEVELOPMENT") {
    // Live reload YAML in dev
    app.use(
      "/api/api-docs",
      swaggerUi.serve,
      (req: Request, res: Response, next: NextFunction) => {
        try {
          const swaggerDocument = loadYaml();
          res.setHeader("Cache-Control", "no-store");
          swaggerUi.setup(swaggerDocument)(req, res, next);
        } catch (err: any) {
          console.error("Swagger load error:", err.message);
          res.status(500).send("Failed to load Swagger docs");
        }
      }
    );
  } else {
    // Load YAML once in prod
    let swaggerDocument: Record<string, any>;
    try {
      swaggerDocument = loadYaml();
    } catch (err: any) {
      console.error("Swagger load error:", err.message);
      swaggerDocument = {}; // fallback empty document
    }
    app.use("/api/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  }
}
