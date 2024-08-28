import express from "express";
import productRoutes from "./routes/v1/productRoutes";
import productCategoryRoutes from "./routes/v1/productCategoryRoutes";
const { connectToDB } = require('./db/connectToDB');

const app = express();
const port = 5000;

app.use(express.json());

app.use("/api/v1/products", productRoutes);
app.use("/api/v1/categories", productCategoryRoutes);

connectToDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`pharmasuite server is running on port ${port}`);
    });
  })
  .catch((err: Error) => {
    console.error("Error starting server:", err);
  });
