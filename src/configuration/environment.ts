import { config } from "dotenv";
import path from "path";

config();

// APP
export const PORT = parseInt(process.env.PORT as string, 10);
export const SRC_PATH = path.join(__dirname, ".."); // ONE level up is /src

// DB
export const DB_PORT = process.env.DB_PORT;
export const DB_USERNAME = process.env.DB_USERNAME;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DB_DATABASE_NAME = process.env.DB_DATABASE_NAME;
export const DB_HOSTNAME = process.env.DB_HOSTNAME;
export const DB_DIALECT = process.env.DB_DIALECT;
export const DB_DEV = process.env.DB_DEV;

// AUTH
export const AUTH_SECRET = process.env.AUTH_SECRET;
export const AUTH_EXPIRES = process.env.AUTH_EXPIRES;
export const AUTH_ROUNDS = process.env.AUTH_ROUNDS;
