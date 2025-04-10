import express from "express";
import morgan from "morgan";
import compression from "compression";
import cors from "cors";
import movieRouter from "./routes/movieRoutes.mjs";
import musicRouter from "./routes/musicRoutes.mjs";
import globalErrorHandler from "./controllers/errorController.mjs";

const app = express();

if (process.env.NODE_ENV === "development") {
  // console.log(process.env.NODE_ENV);
  app.use(morgan("dev"));
}

// Implementing CORS
app.use(
  cors({
    origin: "*",
  }),
);

app.options(
  "*",
  cors({
    origin: "*",
  }),
);

// Compress responses
app.use(compression());

app.use("/api/v1/movies", movieRouter);
app.use("/api/v1/music", musicRouter);

app.use(globalErrorHandler);

export default app;
