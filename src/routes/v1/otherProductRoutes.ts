import { Router } from 'express';
import { addFieldToAllProducts, deleteFieldFromAllProducts, getOtherProducts, getProductById, updateFieldInAllProducts } from '../../controllers/otherProductController';
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
 * @api {get} /api/v1/other-products/:id
 * @apiDescription Get a product details
 * @apiPermission All Users
 * @apiHeader nothing
 * @apiParam product id
 * @apiSuccess {} full product information
 * @apiError no data available in database
 */
.get('/:id', getProductById);

router.patch("/add-field", addFieldToAllProducts);
router.patch("/update-field", updateFieldInAllProducts);
router.patch("/delete-field", deleteFieldFromAllProducts);

router.patch("/:id/add-field", addFieldToAllProducts);
router.patch("/:id/update-field", updateFieldInAllProducts);
router.patch("/:id/delete-field", deleteFieldFromAllProducts);

export default router;
