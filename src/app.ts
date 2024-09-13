import express from "express";
const cors = require('cors');
import mainProductRoutes from "./routes/v1/mainProductRoutes";
import otherProductRoutes from "./routes/v1/otherProductRoutes";
import otherProductCatRoutes from "./routes/v1/otherProductCatRoutes";
import usersRoutes from "./routes/v1/usersRoutes";
const { connectToDB } = require('./db/connectToDB');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.use("/api/v1/main-products", mainProductRoutes);
app.use("/api/v1/other-products", otherProductRoutes);
app.use("/api/v1/other-products/categories", otherProductCatRoutes);
app.use("/api/v1/users", usersRoutes);
// app.use("/api/v1/admin", adminRoutes);

connectToDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`pharmasuite server is running on port ${port}`);
    });
  })
  .catch((err: Error) => {
    console.error("Error starting server:", err);
  });

  app.all("*", (req, res) => {
    res.send("No routes found in server");
})