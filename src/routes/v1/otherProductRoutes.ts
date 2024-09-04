import { Router } from 'express';
import { getAllProductCategories, getOtherProducts, getProductById, getProductsByCategory } from '../../controllers/otherProductController';

const router = Router();

router.get('/', getOtherProducts);
router.get('/all-products', getOtherProducts);

router.get('/:id', getProductById);

router.get("/categories/:cat_name/products", getProductsByCategory);

// categories names
router.get("/categories", getAllProductCategories);

export default router;
