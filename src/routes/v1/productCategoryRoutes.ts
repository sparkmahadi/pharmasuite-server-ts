import { Router } from "express";
import { getAllProductCategories, getProductsByCategory } from "../../controllers/productCategoryController";
const router = Router();

router.get("/", getAllProductCategories);
router.get("/products/:cat_name", getProductsByCategory);

export default router;