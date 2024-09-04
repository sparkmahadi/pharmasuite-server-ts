import express from "express";
import mainProductRoutes from "./routes/v1/mainProductRoutes";
import otherProductRoutes from "./routes/v1/otherProductRoutes";
const { connectToDB } = require('./db/connectToDB');

const app = express();
const port = 5000;

app.use(express.json());

app.use("/api/v1/main-products", mainProductRoutes);
app.use("/api/v1/other-products", otherProductRoutes);

connectToDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`pharmasuite server is running on port ${port}`);
    });
  })
  .catch((err: Error) => {
    console.error("Error starting server:", err);
  });
