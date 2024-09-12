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
