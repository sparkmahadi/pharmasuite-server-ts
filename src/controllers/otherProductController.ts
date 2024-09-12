import { Request, Response } from 'express';
import { db } from '../db/connectToDB';
import { IProduct } from '../models/productModel';
import { ObjectId } from 'mongodb';

const otherProductsColl = db.collection('other-products');
const categoryColl = db.collection("other-categories");

export const getOtherProducts = async (req: Request, res: Response) => {
  const { limit } = req.query;
  console.log(limit);
  try {
    // Convert limit to a number if it's provided, otherwise default to no limit
    const limitNum = limit ? parseInt(limit as string, 10) : 0;
    const products = await otherProductsColl.find().limit(limitNum).toArray();

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getProductById = async (req: Request, res: Response) => {
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

export const getCategoryByName = async (req: Request, res: Response) => {
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

export const postCategory = async (req: Request, res: Response) => {
  const newCategory = req.body;

  try {
    const result = await categoryColl.insertOne(newCategory);
    const insertedId = result.insertedId;

    res.status(201).json({ message: 'Category created successfully', data: { ...newCategory, _id: insertedId } });
  } catch (error:any) {
    res.status(500).json({ message: 'Error creating category', error: error.message });
  }
};

export const updateCategoryById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid category ID' });
    }
    const result = await categoryColl.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({ message: 'Category updated successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating category', error: error.message });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid category ID' });
    }

    // Perform deletion
    const result = await categoryColl.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error: any) {
    // Log the error for debugging
    console.error('Error deleting category:', error);

    res.status(500).json({ message: 'Error deleting category', error: error.message });
  }
};

export const getProductsByCategory = async (req: Request, res: Response) => {
  console.log('hit getproductsbycategory');
  try {
    const catName = req.params.cat_name;
    const limit = req.query.limit;
    const limitNum = limit ? parseInt(limit as string, 10) : 0;
    const products = await otherProductsColl.find({ cat_name: catName }).limit(limitNum).toArray();
    if (products) {
      res.status(200).json(products);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};