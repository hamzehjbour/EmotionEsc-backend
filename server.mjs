/* eslint-disable no-console */
import mongoose from "mongoose";
import app from "./app.mjs";
import { getAccessToken } from "./services/musicServices.mjs";

const port = process.env.PORT || 3000;

getAccessToken();

const DB = process.env.DB.replace("<db_password>", process.env.DB_PASSWORD);

const connect = async function () {
  await mongoose.connect(DB);
  console.log("Database connection successfully");
};

connect();

const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

// process.on("unhandledRejection", (err) => {
//   console.error("UNHANDLED REJECTION 💥 Shutting down...");
//   console.error(err.name, err.message);

//   server.close(() => {
//     process.exit(1);
//   });
// });

// process.on("SIGTERM", () => {
//   console.log("👋SIGTERM Received. Shutting down");

//   server.close(() => {
//     console.log("💥 Process terminated");
//   });
// });
