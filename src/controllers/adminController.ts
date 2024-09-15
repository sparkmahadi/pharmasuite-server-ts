import { Request, Response } from "express";
import { db } from "../db/connectToDB";
import { IProduct } from "../models/productModel";
import { ObjectId } from "mongodb";

const mainProductsColl = db.collection("main-products");
const otherProductsColl = db.collection("other-products");

export const getAllProducts = async (req: Request, res: Response) => {
    try {
        const mainProducts = await mainProductsColl.find().toArray();
        const otherProducts = await otherProductsColl.find().toArray();
        const allProducts = [...mainProducts, ...otherProducts];

        res.json(allProducts);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
