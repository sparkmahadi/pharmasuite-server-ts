import { Request, Response } from 'express';
import { db } from '../db/connectToDB';
import { IProduct } from '../models/productModel';
import { ObjectId } from 'mongodb';

const otherProductsColl = db.collection('other-products');
const categoryColl = db.collection("other-categories");

export const getOtherProducts = async (req: Request, res: Response)=> {
  try {
    const products = await otherProductsColl.find().toArray();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getProductById = async (req: Request, res: Response)=> {
    try {
      const product = await otherProductsColl.findOne({ _id: new ObjectId(req.params.id) });
      if (product) {
        res.json(product);
      } else {
        res.status(404).json({ message: 'Product not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };

  export const getAllProductCategories = async (req: Request, res: Response) => {
    try {
      const categories = await categoryColl.find().toArray();
      res.status(200).json(categories);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  };

  export const getCategoryByName = async (req: Request, res: Response)=> {
    try {
      const category = await categoryColl.findOne({ cat_name: req.params.cat_name });
      if (category) {
        res.json(category);
      } else {
        res.status(404).json({ message: 'Product not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };
  

  export const getProductsByCategory = async (req: Request, res: Response)=> {
    try {
      const catName = req.params.cat_name;
      const products = await otherProductsColl.find({ cat_name : catName }).toArray();
      if (products) {
        res.status(200).json(products);
      } else {
        res.status(404).json({ message: 'Product not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };