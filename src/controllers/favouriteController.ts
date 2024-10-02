import { Request, Response } from "express";
import { db } from "../db/connectToDB";
import { ObjectId } from "mongodb";


const favouritesColl = db.collection("favourites");
const mainProductsColl = db.collection("main-products");
const otherProductsColl = db.collection("other-products");

export const addToFavorites = async (req: Request, res: Response) => {
  const { productId, userId } = req.body;

  if (!productId || !userId) {
    return res.status(400).json({ success: false, message: "Missing required fields: productId and/or userId" });
  }

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


    const existingFavorites = await favouritesColl.findOne({ userId: userIdObj });

    if (existingFavorites) {

      const productAlreadyFavorited = existingFavorites.products.some(
        (favProductId: ObjectId) => favProductId.equals(productIdObj)
      );

      if (productAlreadyFavorited) {
        return res.status(200).json({ success: true, message: "Product already in favorites" });
      }
      await favouritesColl.updateOne(
        { userId: userIdObj },
        { $addToSet: { products: productIdObj } }
      );

      return res.status(200).json({ success: true, message: "Product added to favorites" });
    } else {
      // If no favorites document exists, create a new one with the product
      await favouritesColl.insertOne({
        userId: userIdObj,
        products: [productIdObj]
      });

      return res.status(201).json({ success: true, message: "New favorites document created and product added" });
    }

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
//         return res.status(200).json({ success: false, message: 'Cart not found' });
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
      return res.status(200).json({ success: false, message: "Product not found in favourites" });
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
    const userIdObj = new ObjectId(userId);
    console.log('hit getfavs', userIdObj);
    const favourites = await favouritesColl.find({ userId: userIdObj }).toArray();
    console.log('hit getfavs', favourites);
    if (!favourites) {
      return res.status(200).json({ success: false, message: "Favourites not found" });
    }
    return res.status(200).json({ success: true, favourites });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
