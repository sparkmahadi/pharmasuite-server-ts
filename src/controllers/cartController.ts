import { Request, Response } from "express";
import { db } from "../db/connectToDB";
import { ObjectId } from "mongodb";


const mainProductsColl = db.collection("main-products");
const otherProductsColl = db.collection("other-products");
const cartsColl = db.collection("carts");

export const addToCart = async (req: Request, res: Response) => {
  console.log('hit addtocart');
  const { productId, productName, quantity, price, userId } = req.body;

  try {
    const productIdObj = new ObjectId(productId);
    const userIdObj = new ObjectId(userId);

    let product = await mainProductsColl.findOne({ _id: productIdObj });

    if (!product) {
      product = await otherProductsColl.findOne({ _id: productIdObj });
    }

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const cartItem = {
      userId: userIdObj,
      productId: productIdObj,
      productName,
      quantity: quantity || 1,
      price: price,
      addedAt: new Date(),
    };

    // Insert or update cart item
    await cartsColl.updateOne(
      { userId: userIdObj, productId: productIdObj },
      { $set: cartItem },
      { upsert: true }
    );

    return res.status(200).json({ success: true, message: "Product added to cart" });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Internal server error", error });
  }
};

export const updateCart = async (req: Request, res: Response) => {
  console.log("hit updatecart");
  const userId = req.params.userId;
  const { cart } = req.body;

  if (!userId || !cart) {
    return res.status(400).json({ success: false, message: 'Invalid request' });
  }

  try {
    // Validate userId
    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID' });
    }

    // Update cart for the user
    const result = await cartsColl.updateOne(
      { userId: new ObjectId(userId) },
      { $set: { cart: cart } },
      { upsert: true } // Create a new cart if none exists
    );

    if (result.modifiedCount === 0 && result.upsertedCount === 0) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    return res.status(200).json({ success: true, message: 'Cart saved successfully' });
  } catch (error) {
    console.error('Error saving cart:', error);
    return res.status(500).json({ success: false, message: 'Internal server error', error });
  }
};

export const removeFromCart = async (req: Request, res: Response) => {
  const { productId } = req.body;
  const { userId } = req?.params;

  try {
    const result = await cartsColl.deleteOne({
      userId: new ObjectId(userId),
      productId: new ObjectId(productId),
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: "Product not found in cart" });
    }

    return res.status(200).json({ success: true, message: "Product removed from cart" });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Internal server error", error });
  }
};


export const getCartItems = async (req: Request, res: Response) => {
  const { userId } = req.params;
  console.log(userId);
  try {
    const cart = await cartsColl.find({ userId: new ObjectId(userId) }).toArray();
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }
    return res.status(200).json({ success: true, cart });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
