import express from "express";
import cors from "cors";
import morgan from "morgan";

import { Response } from "express";
import { initializeConfiguration } from "../configuration";

import { PORT } from "../configuration/environment";

import router from "../routes";
import { getFormattedDate } from "../utils/date";

const startServer = async () => {
  const app = express();

  try {
    await initializeConfiguration();

    const server = app.listen(PORT, () => {
      console.log(
        `[server]: ${getFormattedDate()} - Express: API is running at http://localhost:${PORT}`
      );
    });

    app.use(
      cors({
        origin: [
          "http://localhost:3000",
          "http://localhost:5173",
          "https://tecnored.gt.dev.axelaguilar.com",
        ],
      })
    );

    // Define custom log format function
    morgan.token("customFormat", (req, res) => {
      const { method, url, httpVersion, headers } = req;
      return `[server]: ${getFormattedDate()} - Express: Received new HTTP request, type: " ${method}" to: "${url}" HTTP version: "${httpVersion}" from: "${
        headers["user-agent"]
      }"`;
    });

    app.use(morgan(":customFormat"));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(router);

    process.on("SIGINT", () => {
      console.log("[server]: Received SIGINT. Shutting down gracefully...");
      server.close(() => {
        console.log("[server]: Server has been closed.");
        process.exit(0);
      });
    });

    process.on("SIGTERM", () => {
      console.log("[server]: Received SIGTERM. Shutting down gracefully...");
      server.close(() => {
        console.log("[server]: Server has been closed.");
        process.exit(0);
      });
    });
  } catch (error) {
    console.error(`[server]: Fatal error`);
    process.exit(1); // Exit the process with an error code
  }
};

startServer();
