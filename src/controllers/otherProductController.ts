import { Request, Response } from 'express';
import { db } from '../db/connectToDB';
import { IProduct } from '../models/productModel';
import { ObjectId } from 'mongodb';

const otherProductsColl = db.collection('other-products');

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
      res.status(204).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
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
      res.status(204).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


export const addProduct = async (req: Request, res: Response) => {
  const { item_name, cat_name, price, stock_qty, ...otherFields } = req.body;

  // Backend validation
  if (!item_name || typeof item_name !== 'string' || item_name.trim() === '') {
    return res.status(400).json({ message: 'Item name is required and must be a valid string' });
  }
  if (!cat_name || typeof cat_name !== 'string' || cat_name.trim() === '') {
    return res.status(400).json({ message: 'Category name is required and must be a valid string' });
  }
  if (typeof price !== 'number' || price <= 0) {
    return res.status(400).json({ message: 'Price must be a number greater than 0' });
  }
  if (typeof stock_qty !== 'number' || stock_qty <= 0) {
    return res.status(400).json({ message: 'Stock quantity must be a number greater than 0' });
  }

  const newProduct = {
    item_name,
    cat_name,
    price,
    stock_qty,
    ...otherFields,
  };

  try {
    const result = await otherProductsColl.insertOne(newProduct);
    const insertedId = result.insertedId;

    res.status(201).json({
      message: 'Product added successfully',
      data: { ...newProduct, _id: insertedId },
    });
  } catch (error: any) {
    res.status(500).json({
      message: 'Error adding product',
      error: error.message,
    });
  }
};


export const addFieldToAllProducts = async (req: Request, res: Response) => {
  const { fieldName, fieldValue } = req.body;

  try {
    const result = await otherProductsColl.updateMany(
      {},
      { $set: { [fieldName]: fieldValue } }
    );

    res.status(200).json({ message: 'Field added to all products', modifiedCount: result.modifiedCount });
  } catch (error: any) {
    res.status(500).json({ message: 'Error adding field to all products', error: error.message });
  }
};

export const updateFieldInAllProducts = async (req: Request, res: Response) => {
  const { fieldName, newValue } = req.body;

  try {
    const result = await otherProductsColl.updateMany(
      {},
      { $set: { [fieldName]: newValue } }
    );

    res.status(200).json({ message: 'Field updated in all products', modifiedCount: result.modifiedCount });
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating field in all products', error: error.message });
  }
};

export const deleteFieldFromAllProducts = async (req: Request, res: Response) => {
  const { fieldName } = req.body;

  try {
    const result = await otherProductsColl.updateMany(
      {},
      { $unset: { [fieldName]: "" } }
    );

    res.status(200).json({ message: 'Field deleted from all products', modifiedCount: result.modifiedCount });
  } catch (error: any) {
    res.status(500).json({ message: 'Error deleting field from all products', error: error.message });
  }
};

export const addFieldToProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { fieldName, fieldValue } = req.body;

  try {
    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    const result = await otherProductsColl.updateOne(
      { _id: new ObjectId(id) },
      { $set: { [fieldName]: fieldValue } }
    );

    if (result.modifiedCount === 0) {
      return res.status(200).json({ message: 'product not found' });
    }

    res.status(200).json({ message: 'Field added to product', modifiedCount: result.modifiedCount });
  } catch (error: any) {
    // Log the error for debugging
    console.error('Error adding field to product:', error);

    res.status(500).json({ message: 'Error adding field to product', error: error.message });
  }
};

export const updateFieldInProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { fieldName, newValue } = req.body;

  try {
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    const result = await otherProductsColl.updateOne(
      { _id: new ObjectId(id) },
      { $set: { [fieldName]: newValue } }
    );

    if (result.modifiedCount === 0) {
      return res.status(200).json({ message: 'Product not found or field not updated' });
    }

    res.status(200).json({ message: 'Field updated in product', modifiedCount: result.modifiedCount });
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating field in product', error: error.message });
  }
};

export const deleteFieldFromProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { fieldName } = req.body;

  try {
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    const result = await otherProductsColl.updateOne(
      { _id: new ObjectId(id) },
      { $unset: { [fieldName]: "" } }
    );

    if (result.modifiedCount === 0) {
      return res.status(200).json({ message: 'Product not found or field not deleted' });
    }

    res.status(200).json({ message: 'Field deleted from product', modifiedCount: result.modifiedCount });
  } catch (error: any) {
    res.status(500).json({ message: 'Error deleting field from product', error: error.message });
  }
};
