import { Request, Response } from "express";
import { db } from "../db/connectToDB";
import { ObjectId } from "mongodb";

const bcrypt = require("bcrypt");

const usersColl = db.collection("users");

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const alluser = await usersColl
      .find({}, { projection: { password: 0 } })
      .toArray();

    return res.status(200).json({
      success: true,
      message: "All users retrieved successfully",
      data: alluser,
    });
  } catch (error: any) {
    console.error("Error fetching users:", error.message);
    return res.status(409).json({
      success: false,
      message: "Server error",
    });
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

export const getUserById = async (req: Request, res: Response) => {
  console.log("hit get user by id");
  try {
    const { id } = req.params;

    // Check if the id is valid before converting to ObjectId
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format",
      });
    }

    const filter = { _id: new ObjectId(id) };
    const result = await usersColl.findOne(filter, {
      projection: { password: 0 },
    });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User found successfully",
      data: result,
    });
  } catch (error: any) {
    console.error("Error finding user:", error?.message);
    return res.status(500).json({
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

export const updateUserRole = async (req: Request, res: Response) => {
  console.log("hit update user role route");
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format",
      });
    }
    const { role } = req.body;
    console.log(role);
    const filter = { _id: new ObjectId(id) };
    const updatedUser = { $set: { role } };
    if (role) {
      const result = await usersColl.updateOne(filter, updatedUser);
      res.status(200).json({
        success: true,
        message: "User role updated successfully",
        data: result,
      });
    } else {
      res.status(409).json({
        success: false,
        message: "Please select correct user role",
      });
    }
  } catch (error) {
    res.status(409).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  console.log("hit delete");
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format",
      });
    }
    const filter = { _id: new ObjectId(id) };
    const result = await usersColl.deleteOne(filter);
    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }
    res.status(200).json({
      success: true,
      message: "User deleted successfully.",
    });
  } catch (error: any) {
    console.error("Error fetching users:", error.message);
    return res.status(409).json({
      success: false,
      message: "Server error",
    });
  }
};