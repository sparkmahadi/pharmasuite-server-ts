import { Request, Response } from "express";
import { db } from "../db/connectToDB";
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

export const getProductById = async (req: Request, res: Response) => {
    try {
        const product = await mainProductsColl.findOne({ _id: new ObjectId(req.params.id) });
        if (product) {
            res.json(product);
        } else {
            const product = await otherProductsColl.findOne({ _id: new ObjectId(req.params.id) });
            if (product) {
                res.json(product);
            } else {
                res.status(404).json({ message: "Product not found" });
            }
        }

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
