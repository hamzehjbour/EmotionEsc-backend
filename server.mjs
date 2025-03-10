import app from "./app.mjs";

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

process.on("SIGTERM", () => {
  console.log("👋SIGTERM Received. Shutting down");

  server.close(() => {
    console.log("💥 Process terminated");
  });
});
