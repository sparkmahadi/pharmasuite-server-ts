import { Request, Response } from "express";
import { db } from "../db/connectToDB";
import { IProduct } from "../models/productModel";
import { ObjectId } from "mongodb";

const mainProductsColl = db.collection("main-products");
const otcCategoryColl = db.collection("otc-categories");

export const getMainProducts = async (req: Request, res: Response) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);

    const skip = (pageNum - 1) * limitNum;
    const totalProductsCount = await mainProductsColl.countDocuments();
    const products = await mainProductsColl.find().skip(skip).limit(limitNum).toArray();

    // Calculate total pages
    const totalPages = Math.ceil(totalProductsCount / limitNum);
    res.json({
      page: pageNum,
      limit: limitNum,
      totalProducts: totalProductsCount,
      totalPages,
      products,  
    });
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
      res.status(204).json({ message: "Product not found" });
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
      res.status(204).json({ message: "Product not found" });
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
        res.status(204).json({ message: "Product not found" });
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

export const addProduct = async (req: Request, res: Response) => {
  const {
    item_name,
    item_desc,
    generic_name,
    images,
    inventory,
    cat_id,
    cat_name,
    manufacturers,
    manufacturers_alias,
    sku_type,
    item_type,
    is_featured,
    comes_under,
    is_prescription_required,
    alias,
    generic_alias,
    is_available,
    alternative_items,
    related_items,
    available_stock_qty_in_pc,
  } = req.body;

  // Backend validation
  if (!item_name || typeof item_name !== 'string' || item_name.trim() === '') {
    return res.status(400).json({ message: 'Item name is required and must be a valid string' });
  }
  if (!cat_name || typeof cat_name !== 'string' || cat_name.trim() === '') {
    return res.status(400).json({ message: 'Category name is required and must be a valid string' });
  }
  if (!inventory || !Array.isArray(inventory) || inventory.length === 0 || inventory[0].price <= 0) {
    return res.status(400).json({ message: 'Price is required and must be greater than 0' });
  }
  if (inventory[0].stock_qty <= 0) {
    return res.status(400).json({ message: 'Stock quantity must be greater than 0' });
  }

  const newProduct = {
    item_name,
    item_desc,
    generic_name,
    images,
    inventory,
    cat_id,
    cat_name,
    manufacturers,
    manufacturers_alias,
    sku_type,
    item_type,
    is_featured,
    comes_under,
    is_prescription_required,
    alias,
    generic_alias,
    is_available,
    alternative_items,
    related_items,
    available_stock_qty_in_pc,
  };

  try {
    const result = await mainProductsColl.insertOne(newProduct);
    const insertedId = result.insertedId;
    res.status(201).json({
      message: 'Product added successfully',
      data: { ...newProduct, _id: insertedId },
    });
  } catch (error:any) {
    res.status(500).json({ message: 'Error adding product', error: error.message });
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
      return res.status(200).json({ message: 'Product not found' });
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

    const result = await mainProductsColl.updateOne(
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


