import { Router } from 'express';
import { getAllProducts, getProductById } from '../controllers/productController';

const router = Router();

router.get('/products', getAllProducts);
router.get('/products/:id', getProductById);

export default router;
