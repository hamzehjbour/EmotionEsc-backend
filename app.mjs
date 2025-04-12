import express from "express";
import morgan from "morgan";
import compression from "compression";
import cors from "cors";
import cookieParser from "cookie-parser";
import movieRouter from "./routes/movieRoutes.mjs";
import musicRouter from "./routes/musicRoutes.mjs";
import authRouter from "./routes/authRoutes.mjs";
import globalErrorHandler from "./controllers/errorController.mjs";

const app = express();

if (process.env.NODE_ENV === "development") {
  // console.log(process.env.NODE_ENV);
  app.use(morgan("dev"));
}

app.use(cookieParser());

app.use(express.json());

// Implementing CORS
app.use(
  cors({
    origin: "https://localhost:4200",
    credentials: true,
  }),
);

app.options(
  "*",
  cors({
    origin: "https://localhost:4200",
    credentials: true,
  }),
);

// Compress responses
app.use(compression());

app.use("/api/v1/movies", movieRouter);
app.use("/api/v1/music", musicRouter);
app.use("/api/v1/auth", authRouter);

app.use(globalErrorHandler);

export default app;
