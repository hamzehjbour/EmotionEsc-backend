import express from "express";
import morgan from "morgan";
import compression from "compression";
import cors from "cors";
import cookieParser from "cookie-parser";
import movieRouter from "./routes/movieRoutes.mjs";
import musicRouter from "./routes/musicRoutes.mjs";
import authRouter from "./routes/authRoutes.mjs";
import libraryRouter from "./routes/libraryRoutes.mjs";
import globalErrorHandler from "./controllers/errorController.mjs";

const app = express();

const allowedOrigins = ["https://127.0.0.1:4200", "https://localhost:4200"];

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(cookieParser());

app.use(express.json());

// Implementing CORS

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);

app.options(
  "*",
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);
// Compress responses
app.use(compression());

app.use("/api/v1/library", libraryRouter);
app.use("/api/v1/movies", movieRouter);
app.use("/api/v1/music", musicRouter);
app.use("/api/v1/auth", authRouter);

app.use(globalErrorHandler);

export default app;
