import { Router } from 'express';
import { getCategoryByName, getAllProductCategories, getOtherProducts, getProductById, getProductsByCategory } from '../../controllers/otherProductController';

const router = Router();

router.get('/', getOtherProducts);
router.get('/all-products', getOtherProducts);
router.get("/categories", getAllProductCategories);
router.get("/categories/:cat_name", getCategoryByName);

router.get('/:id', getProductById);
router.get("/categories/:cat_name/products", getProductsByCategory);

export default router;
