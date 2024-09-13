import { Router } from 'express';
import { addFieldToAllCategories, addFieldToCategory, deleteCategory, deleteFieldFromAllCategories, deleteFieldFromCategory, getAllProductCategories, getCategoryByName, postCategory, updateCategoryById, updateFieldInAllCategories, updateFieldInCategory } from '../../controllers/otherProductCatController';
import { getProductsByCategory } from '../../controllers/otherProductController';
const router = Router();

router
/**
 * @api {get} /api/v1/other-products
 * @apiDescription Get all secondary products categories
 * @apiPermission All Users
 * @apiHeader nothing
 * @apiParam nothing
 * @apiSuccess {Object[]} full lot information
 * @apiError no data available in database
*/
.route("/").get(getAllProductCategories).post(postCategory);

router.route("/:id").patch(updateCategoryById).delete(deleteCategory);

router
/**
 * @api {get} /api/v1/other-products/:cat_name
 * @apiDescription Get a category details
 * @apiPermission All Users
 * @apiHeader nothing
 * @apiParam category name
 * @apiSuccess {} full category information
 * @apiError no data available in database
 */
.get("/:cat_name", getCategoryByName)
router.patch("/add-field", addFieldToAllCategories);
router.patch("/update-field", updateFieldInAllCategories);
router.patch("/delete-field", deleteFieldFromAllCategories);

router.patch("/:id/add-field", addFieldToCategory);
router.patch("/:id/update-field", updateFieldInCategory);
router.patch("/:id/delete-field", deleteFieldFromCategory);

router
/**
 * @api {get} /api/v1/other-products/:cat_name/products
 * @apiDescription Get all products under a category
 * @apiPermission All Users
 * @apiHeader nothing
 * @apiParam category name
 * @apiSuccess {Object[]} full product information
 * @apiError no data available in database
 */
.get("/:cat_name/products", getProductsByCategory);

export default router;
