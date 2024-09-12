import { Router } from 'express';
import { getCategoryByName, getAllProductCategories, getOtherProducts, getProductById, getProductsByCategory, updateCategoryById, postCategory, deleteCategory, addFieldToAllCategories, updateFieldInAllCategories, deleteFieldFromAllCategories, addFieldToCategory, updateFieldInCategory, deleteFieldFromCategory } from '../../controllers/otherProductController';

const router = Router();

router
/**
 * @api {get} /api/v1/other-products
 * @apiDescription Get all secondary products
 * @apiPermission All Users
 * @apiHeader nothing
 * @apiParam nothing
 * @apiSuccess {Object[]} full lot information
 * @apiError no data available in database
 */
.get('/', getOtherProducts);
router.get('/all-products', getOtherProducts);


router
/**
 * @api {get} /api/v1/other-products/categories
 * @apiDescription Get all secondary products categories
 * @apiPermission All Users
 * @apiHeader nothing
 * @apiParam nothing
 * @apiSuccess {Object[]} full lot information
 * @apiError no data available in database
 */
.get("/categories", getAllProductCategories);

router
/**
 * @api {get} /api/v1/other-products/categories/:cat_name
 * @apiDescription Get a category details
 * @apiPermission All Users
 * @apiHeader nothing
 * @apiParam category name
 * @apiSuccess {} full category information
 * @apiError no data available in database
 */
.get("/categories/:cat_name", getCategoryByName)
router.post("/categories", postCategory);
router.patch("/categories/add-field", addFieldToAllCategories);
router.patch("/categories/update-field", updateFieldInAllCategories);
router.patch("/categories/delete-field", deleteFieldFromAllCategories);

router.patch("/categories/:id/add-field", addFieldToCategory);
router.patch("/categories/:id/update-field", updateFieldInCategory);
router.patch("/categories/:id/delete-field", deleteFieldFromCategory);

router.patch("/categories/:id", updateCategoryById);
router.delete("/categories/:id", deleteCategory);

router
/**
 * @api {get} /api/v1/other-products/:id
 * @apiDescription Get a product details
 * @apiPermission All Users
 * @apiHeader nothing
 * @apiParam product id
 * @apiSuccess {} full product information
 * @apiError no data available in database
 */
.get('/:id', getProductById);

router
/**
 * @api {get} /api/v1/other-products/categories/:cat_name/products
 * @apiDescription Get all products under a category
 * @apiPermission All Users
 * @apiHeader nothing
 * @apiParam category name
 * @apiSuccess {Object[]} full product information
 * @apiError no data available in database
 */
.get("/categories/:cat_name/products", getProductsByCategory);

export default router;
