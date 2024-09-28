import { Request, Response } from "express";
import { db } from "../db/connectToDB";
import { ObjectId } from "mongodb";


const favouritesColl = db.collection("favourites");

export const addToFavorites = async (req: Request, res: Response) => {
  const { productId } = req.body;
  const { userId } = req?.params;

  try {
    const product = await favouritesColl.findOne({ _id: new ObjectId(productId) });

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Add product to user's favorites
    await favouritesColl.updateOne(
      { userId: new ObjectId(userId) },
      { $addToSet: { products: new ObjectId(productId) } }, // Add productId to favorites array
      { upsert: true }
    );

    return res.status(200).json({ success: true, message: "Product added to favorites" });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Internal server error", error });
  }
};

// export const updateFavourites = async (req: Request, res: Response) => {
//     console.log("hit updatefavourites");
//     const userId = req.params.userId;
//     const { cart } = req.body;
  
//     if (!userId || !cart) {
//       return res.status(400).json({ success: false, message: 'Invalid request' });
//     }
  
//     try {
//       // Validate userId
//       if (!ObjectId.isValid(userId)) {
//         return res.status(400).json({ success: false, message: 'Invalid user ID' });
//       }
  
//       // Update cart for the user
//       const result = await favouritesColl.updateOne(
//         { userId: new ObjectId(userId) },
//         { $set: { cart: cart } },
//         { upsert: true } // Create a new cart if none exists
//       );
  
//       if (result.modifiedCount === 0 && result.upsertedCount === 0) {
//         return res.status(404).json({ success: false, message: 'Cart not found' });
//       }
  
//       return res.status(200).json({ success: true, message: 'Cart saved successfully' });
//     } catch (error) {
//       console.error('Error saving cart:', error);
//       return res.status(500).json({ success: false, message: 'Internal server error', error });
//     }
//   };

export const removeFromFavourites = async (req: Request, res: Response) => {
  try {
    const { userId, productId } = req.body;

    // Convert userId and productId to ObjectId
    const userObjectId = new ObjectId(userId);
    const productObjectId = new ObjectId(productId);

    // Delete the favourite based on userId and productId
    const deleteResult = await favouritesColl.deleteOne({
      userId: userObjectId,
      productId: productObjectId
    });

    if (deleteResult.deletedCount === 0) {
      return res.status(404).json({ success: false, message: "Product not found in favourites" });
    }

    return res.status(200).json({ success: true, message: "Product removed from favourites" });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get Favourites for a User
export const getFavourites = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const favourites = await favouritesColl.findOne({ userId });
    if (!favourites) {
      return res.status(404).json({ success: false, message: "Favourites not found" });
    }
    return res.status(200).json({ success: true, favourites });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
