import { Router } from 'express';
import { addFieldToAllProducts, addFieldToProduct, deleteFieldFromAllProducts, deleteFieldFromProduct, getAllSubCategories, getMainProducts, getProductById, getProductsByCategory, getProductsBySubCategory, updateFieldInAllProducts, updateFieldInProduct } from '../../controllers/mainProductController';

const router = Router();

// products
router.get('/', getMainProducts);
router.get('/all-products', getMainProducts);

router.get('/:id', getProductById);

router.patch("/:id/add-field", addFieldToProduct);
router.patch("/:id/update-field", updateFieldInProduct);
router.patch("/:id/delete-field", deleteFieldFromProduct);

router.patch("/add-field", addFieldToAllProducts);
router.patch("/update-field", updateFieldInAllProducts);
router.patch("/delete-field", deleteFieldFromAllProducts);

router.get('/categories/:cat_name/products', getProductsByCategory); 
router.get('/categories/:cat_name/:sub_cat_name/products', getProductsBySubCategory);

// categories
router.get('/categories/sub-categories/:cat_name', getAllSubCategories);

export default router;
