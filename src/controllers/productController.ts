import { Request, Response } from 'express';
import { db } from '../db/connectToDB';
import { IProduct } from '../models/productModel';

export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const productsCollection = db.collection<IProduct>('products');
    const products = await productsCollection.find().toArray();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const productsCollection = db.collection<IProduct>('products');
    const product = await productsCollection.findOne({ _id: req.params.id });
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
