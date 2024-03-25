import { getFormattedDate } from "../utils/date";
import { sequelize } from "./database";

const initializeDB = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({
      force: true,
    });
    console.log(
      `[server]: ${getFormattedDate()} - Sequelize: Database connection has been established successfully.`
    );
  } catch (error) {
    console.error(
      `[server]: ${getFormattedDate()} - Sequelize: Unable to connect to the database`
    );
    throw error; // Propagate the error to the caller
  }
};

const initializeConfiguration = async () => {
  try {
    await initializeDB();
  } catch (error) {
    console.error(
      "[server]: There was a problem while initializing the configuration"
    );
    throw error;
  }
};

export { initializeConfiguration };
