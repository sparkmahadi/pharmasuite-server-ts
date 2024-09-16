import { Router } from "express";
import { cancelOrder, getOrderHistory, placeOrder } from "../../controllers/orderController";

const router = Router();

router.get("/:userId", getOrderHistory);

router.post("/place", placeOrder);
router.patch("/cancel/:orderId", cancelOrder);

export default router;