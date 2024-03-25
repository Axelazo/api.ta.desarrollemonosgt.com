import { Dialect, Sequelize } from "sequelize";

import { getFormattedDate } from "../utils/date";
import { DB_DATABASE_NAME, DB_DIALECT, DB_HOSTNAME, DB_PASSWORD, DB_PORT, DB_USERNAME } from "./environment";

let sequelize: Sequelize;

try {
  if (
    !DB_PORT ||
    !DB_USERNAME ||
    !DB_PASSWORD ||
    !DB_DATABASE_NAME ||
    !DB_HOSTNAME ||
    !DB_DIALECT
  ) {
    throw new Error("One or more required environment variables are undefined");
  }

  sequelize = new Sequelize({
    port: parseInt(DB_PORT),
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_DATABASE_NAME,
    host: DB_HOSTNAME,
    define: {
      paranoid: true, // Enables deletedAt field to be used in the isDeleted requirement, automatically soft-deletes records and retrieves only non soft-deleted records!
    },
    timezone: "-06:00", // GMT -6 for Guatemala!
    dialect: DB_DIALECT as Dialect,
    logging: (sql) => {
      const trimmedSql = sql.length > 100 ? sql.substring(0, 100) + "..." : sql;
      console.log(`[server]: ${getFormattedDate()} - Sequelize: ${trimmedSql}`);
    },
  });

  console.log(
    `[server]: ${getFormattedDate()} - Sequelize: Successfully initialized Sequelize.`
  );
} catch (error) {
  console.error(
    `[server]: ${getFormattedDate()} - Sequelize: Error initializing Sequelize`
  );
  throw error;
}

export { sequelize };
