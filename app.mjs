import express from "express";
import morgan from "morgan";
import compression from "compression";
import cors from "cors";
import movieRouter from "./routes/movieRoutes.mjs";

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Implementing CORS
app.use(
  cors({
    origin: "http://127.0.0.1:4200",
  }),
);

app.options(
  "*",
  cors({
    origin: "http://127.0.0.1:4200",
  }),
);

// Compress responses
app.use(compression());

app.use("/api/v1/movies", movieRouter);

export default app;
