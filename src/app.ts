import express from 'express';
import productRoutes from './routes/productRoutes';

const app = express();
const port = 5000;

app.use(express.json());

app.use('/api', productRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
