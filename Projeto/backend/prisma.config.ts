// prisma.config.ts
import { defineConfig, env } from "@prisma/config";
import "dotenv/config"; // carrega .env automaticamente

export default defineConfig({
  schema: "prisma/schema.prisma",           // caminho relativo ao prisma.config.ts
  migrations: {
    path: "prisma/migrations",              // pasta padrão das migrações
  },
  datasource: {
    url: env("DATABASE_URL"),               // lê do .env
  },
});