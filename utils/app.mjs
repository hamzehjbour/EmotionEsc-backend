import express from "express";
import musicRouter from "./routes/musicRoutes.mjs";

// Create an Express app
const app = express();

// Use the music router at the /api path
app.use("/api", musicRouter);

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
