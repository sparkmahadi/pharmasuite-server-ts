import { Router } from 'express';
import { addFieldToAllCategories, addFieldToCategory, deleteCategory, deleteFieldFromAllCategories, deleteFieldFromCategory, getAllProductCategories, getCategoryByName, postCategory, updateCategoryById, updateFieldInAllCategories, updateFieldInCategory } from '../../controllers/otherProductCatController';
import { getProductsByCategory } from '../../controllers/otherProductController';
const router = Router();

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
