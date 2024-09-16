import { Router } from "express";
import { addToCart, getCartItems, updateCart } from "../../controllers/cartController";

const router = Router();

router.route("/:userId")
.get(getCartItems)
.put(updateCart);

router.post('/add-to-cart', addToCart);

export default router;