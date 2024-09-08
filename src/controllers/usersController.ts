import { Request, Response } from 'express';
import { db } from '../db/connectToDB';
import { ObjectId } from 'mongodb';

const bcrypt = require("bcrypt");

const usersColl = db.collection('users');

export const getUsers = async (req: Request, res: Response) => {
    try {
        const products = await usersColl.find().toArray();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getUserByEmail = async (req: Request, res: Response) => {
    console.log("hit login");
    try {
      const { email } = req.query;
      const userCred = await usersColl.findOne({ email });

      if (!userCred) {
        return res.status(409).json({
          success: false,
          message: "User not found",
        });
      }

      // If user is found, return user details
      res.status(200).json({
        success: true,
        data: userCred,
      });
    } catch (error: any) {
      // Handle any server errors
      console.error("Error fetching user by email:", error.message);
      return res.status(409).json({
        success: false,
        message: "Server error",
      });
    }
  };

export const postUser = async (req: Request, res: Response) => {
console.log("hit hit");
    try {
        const { name, email, password } = req.body;

        // Check if a user with this email already exists
        const existingUser = await usersColl.findOne({ email });
        if (existingUser) {
            return res.status(406).json({
                success: false,
                message: "A user with this email already exists.",
            });
        }

        // Hash the password before saving it
        const saltRounds = 10; // You can adjust the salt rounds (more rounds = more secure, but slower)
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create a new user object with the hashed password
        const newUser = { name, email, password: hashedPassword, role: "user" };

        // Insert the new user into the database
        const result = await usersColl.insertOne(newUser);
        console.log(result);
        // Respond with success message and the new user data
        res.status(201).json({
            success: true,
            message: "New user registered successfully",
            data: newUser, // Return the inserted document
        });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(409).json({
            success: false,
            message: "Internal server error.",
        });
    }

};