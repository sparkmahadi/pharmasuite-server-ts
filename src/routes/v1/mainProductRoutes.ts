import { Router } from 'express';
import { getAllSubCategories, getMainProducts, getProductById, getProductsByCategory } from '../../controllers/mainProductController';

const router = Router();

// products
router.get('/', getMainProducts);
router.get('/all-products', getMainProducts);

router.get('/:id', getProductById);

// router.get('/categories/:cat-name/products', getProductsByCategory); 
// router.get('/categories/:cat-name/:sub-cat-name/products', getProductById);

// categories
router.get('/categories/sub-categories/:cat_name', getAllSubCategories);

export default router;
