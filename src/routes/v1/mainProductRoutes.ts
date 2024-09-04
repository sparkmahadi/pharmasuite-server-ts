import { Router } from 'express';
import { getAllSubCategories, getMainProducts, getProductById, getProductsByCategory, getProductsBySubCategory } from '../../controllers/mainProductController';

const router = Router();

// products
router.get('/', getMainProducts);
router.get('/all-products', getMainProducts);

router.get('/:id', getProductById);

router.get('/categories/:cat_name/products', getProductsByCategory); 
router.get('/categories/:cat_name/:sub_cat_name/products', getProductsBySubCategory);

// categories
router.get('/categories/sub-categories/:cat_name', getAllSubCategories);

export default router;
