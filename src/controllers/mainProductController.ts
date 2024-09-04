import { Request, Response } from "express";
import { db } from "../db/connectToDB";
import { IProduct } from "../models/productModel";
import { ObjectId } from "mongodb";

const mainProductsColl = db.collection("main-products");
const otcCategoryColl = db.collection("otc-categories");

export const getMainProducts = async (req: Request, res: Response) => {
  try {
    const products = await mainProductsColl.find().toArray();
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

export const getProductsByCategory = async (req: Request, res: Response) => {
  try {
    const categoryName = req.params.cat_name;
    const products = await mainProductsColl
      .find({ cat_name: req.params.cat_name })
      .toArray();
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
