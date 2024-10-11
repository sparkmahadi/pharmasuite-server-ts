import { Request, Response } from "express";
import { db } from "../db/connectToDB";
import { ObjectId } from "mongodb";

const mainProductsColl = db.collection("main-products");
const otherProductsColl = db.collection("other-products");

export const getAllProducts = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1; 
    const limit = parseInt(req.query.limit as string) || 10; 
    const skip = (page - 1) * limit;

    try {
        // Fetch all products from both collections (without applying pagination at this stage)
        const mainProducts = await mainProductsColl.find().toArray();
        const otherProducts = await otherProductsColl.find().toArray();

        // Combine both collections
        const combinedProducts = [...mainProducts, ...otherProducts];

        // Apply pagination to the combined data
        const paginatedProducts = combinedProducts.slice(skip, skip + limit);

        // Send the paginated products response
        res.json({
            page,
            limit,
            totalProducts: combinedProducts.length,
            totalPages: Math.ceil(combinedProducts.length / limit), 
            products: paginatedProducts,
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
            const product = await otherProductsColl.findOne({ _id: new ObjectId(req.params.id) });
            if (product) {
                res.json(product);
            } else {
                res.status(204).json({ message: "Product not found" });
            }
        }

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
