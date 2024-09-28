import { Router } from 'express';
import { getAllProducts, getProductById } from '../../controllers/allProductController';
const router = Router();

// products
router.get('/get-all-products', getAllProducts);
router.get('/:id', getProductById);

export default router;
