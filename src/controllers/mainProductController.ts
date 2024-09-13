import { Request, Response } from "express";
import { db } from "../db/connectToDB";
import { IProduct } from "../models/productModel";
import { ObjectId } from "mongodb";

const mainProductsColl = db.collection("main-products");
const otcCategoryColl = db.collection("otc-categories");

export const getMainProducts = async (req: Request, res: Response) => {
  const { limit } = req.query;
  console.log(limit);
  try {
    // Convert limit to a number if it's provided, otherwise default to no limit
    const limitNum = limit ? parseInt(limit as string, 10) : 0;
    const products = await mainProductsColl.find().limit(limitNum).toArray();

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await mainProductsColl.findOne({ _id: new ObjectId(req.params.id) });
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


// otc or prescription
export const getProductsByCategory = async (req: Request, res: Response) => {
  try {
    const catName = req.params.cat_name;
    console.log(catName);
    const products = await mainProductsColl.find({ comes_under: req.params.cat_name }).toArray();
    if (products) {
      res.status(200).json(products);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getProductsBySubCategory = async (req: Request, res: Response) => {
    try {
      const catName = req.params.cat_name;
      const subCatName = req.params.sub_cat_name;
      console.log(catName,subCatName);
      const query = { item_desc: { $regex: subCatName, $options: 'i' } }; // 'i' makes the search case-insensitive
      const products = await mainProductsColl.find(query).toArray();
      if (products) {
        res.status(200).json(products);
      } else {
        res.status(404).json({ message: "Product not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  };

export const getAllSubCategories = async (req: Request, res: Response) => {
  const catName = req.params.cat_name;
  console.log(catName);
  try {
    if (catName === "otc-medicines") {
      const categories = await otcCategoryColl.find().toArray();
      res.status(200).json(categories);
    } else {
      res
        .status(400)
        .json({ message: `no subcategories found for category ${catName}` });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const addFieldToAllProducts = async (req: Request, res: Response) => {
  const { fieldName, fieldValue } = req.body;

  try {
    const result = await mainProductsColl.updateMany(
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
    const result = await mainProductsColl.updateMany(
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
    const result = await mainProductsColl.updateMany(
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
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    const result = await mainProductsColl.updateOne(
      { _id: new ObjectId(id) },
      { $set: { [fieldName]: fieldValue } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Field added to product', modifiedCount: result.modifiedCount });
  } catch (error: any) {
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

    const result = await mainProductsColl.updateOne(
      { _id: new ObjectId(id) },
      { $set: { [fieldName]: newValue } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: 'Product not found or field not updated' });
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

    const result = await mainProductsColl.updateOne(
      { _id: new ObjectId(id) },
      { $unset: { [fieldName]: "" } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: 'Product not found or field not deleted' });
    }

    res.status(200).json({ message: 'Field deleted from product', modifiedCount: result.modifiedCount });
  } catch (error: any) {
    res.status(500).json({ message: 'Error deleting field from product', error: error.message });
  }
};


