import { Request, Response } from "express";
import { db } from "../db/connectToDB";
import { ObjectId } from "mongodb";


const mainProductsColl = db.collection("main-products");
const otherProductsColl = db.collection("other-products");
const cartsColl = db.collection("carts");
const favouritesColl = db.collection("favourites");
const ordersColl = db.collection("orders");


// export const old placeOrder = async (req: Request, res: Response) => {
//   const { items, shippingAddress } = req.body;
//   const {userId} = req.params;

//   try {
//     const order = {
//       userId: new ObjectId(userId),
//       items: items.map((item: any) => ({
//         productId: new ObjectId(item.productId),
//         quantity: item.quantity,
//       })),
//       totalPrice: items.reduce((total: number, item: any) => total + item.price * item.quantity, 0),
//       shippingAddress,
//       createdAt: new Date(),
//       status: "pending", // Initial order status
//     };

//     // Insert the order
//     const result = await ordersColl.insertOne(order);

//     // Clear the user's cart after the order is placed
//     await cartsColl.deleteMany({ userId: new ObjectId(userId) });

//     return res.status(201).json({ success: true, orderId: result.insertedId });
//   } catch (error : any) {
//     return res.status(500).json({ success: false, message: "Internal server error", error });
//   }
// };

export const placeOrder = async (req: Request, res: Response) => {
  console.log('hit place order');
  const { userId } = req.body;
  try {
    const cartItems = await cartsColl.find({ userId: new ObjectId(userId) }).toArray();
    // console.log(cartItems);

    if (!cartItems.length) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    // Create order items array
    const items = cartItems.map((item: any) => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.price
    }));

    // Calculate total amount
    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Create new order
    const newOrder = {
      userId: new ObjectId(userId),
      items,
      totalAmount,
      status: "pending",
      orderDate: new Date()
    };

    const result = await ordersColl.insertOne(newOrder);

    // Clear cart after placing the order
    await cartsColl.deleteMany({ userId: new ObjectId(userId) });

    return res.status(201).json({ success: true, orderId: result.insertedId, message: "Order placed successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error", error });
  }
};

export const cancelOrder = async (req: Request, res: Response) => {
  const orderId = req.params.orderId;
console.log("hit cancelOrder");
  try {
    // Validate orderId
    if (!ObjectId.isValid(orderId)) {
      return res.status(400).json({ success: false, message: 'Invalid order ID' });
    }

    // Find the order and check if it was placed within the last 12 hours
    const order = await ordersColl.findOne({ _id: new ObjectId(orderId) });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const currentTime = new Date().getTime();
    const orderTime = new Date(order.orderDate).getTime();
    const twelveHoursInMillis = 12 * 60 * 60 * 1000;

    if (currentTime - orderTime > twelveHoursInMillis) {
      return res.status(400).json({ success: false, message: 'Cannot cancel order after 12 hours' });
    }

    // Update the order status to "cancelled"
    const result = await ordersColl.updateOne(
      { _id: new ObjectId(orderId) },
      { $set: { status: 'cancelled' } }
    );

    if (result.modifiedCount === 0) {
      return res.status(500).json({ success: false, message: 'Failed to cancel order' });
    }

    return res.status(200).json({ success: true, message: 'Order cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling order:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getOrderHistory = async (req: Request, res: Response) => {
  const { userId } = req.params;
  console.log(userId);
  console.log("hit orderhistory");
  try {
    const orders = await ordersColl.find({ userId: new ObjectId(userId) }).toArray();
    if (orders?.length === 0) {
      return res.status(404).json({ success: false, message: "No orders found" });
    }
    return res.status(200).json({ success: true, orders });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};