import { Router } from 'express';
import { getAllProducts } from '../../controllers/adminController';
const router = Router();

// products
router.get('/get-all-products', getAllProducts);

export default router;
