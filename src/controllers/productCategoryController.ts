import { Request, Response } from "express";
import { db } from "../db/connectToDB";
import { IProduct } from "../models/productModel";

export const getAllProductCategories = async (req: Request, res: Response) => {
  try {
    const categoryCollection =
      db.collection<IProduct>("product-categories");
    
      const categories = await categoryCollection.find().toArray();
      res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getProductsByCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const categoryName = req.params.cat_name;
    const productsCollection = db.collection('products');
    const products = await productsCollection.find({ cat_name : req.params.cat_name }).toArray();
    if (products) {
      res.status(200).json(products);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
