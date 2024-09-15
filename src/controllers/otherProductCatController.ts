import { Request, Response } from 'express';
import { db } from '../db/connectToDB';
import { ObjectId } from 'mongodb';

const categoryColl = db.collection("other-categories");

export const getAllProductCategories = async (req: Request, res: Response) => {
  try {
    const categories = await categoryColl.find().toArray();
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getCategoryByName = async (req: Request, res: Response) => {
  try {
    const category = await categoryColl.findOne({ cat_name: req.params.cat_name });
    if (category) {
      res.json(category);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const postCategory = async (req: Request, res: Response) => {
  const newCategory = req.body;

  try {
    const result = await categoryColl.insertOne(newCategory);
    const insertedId = result.insertedId;

    res.status(201).json({ message: 'Category created successfully', data: { ...newCategory, _id: insertedId } });
  } catch (error: any) {
    res.status(500).json({ message: 'Error creating category', error: error.message });
  }
};

export const updateCategoryById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid category ID' });
    }
    const result = await categoryColl.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({ message: 'Category updated successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating category', error: error.message });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid category ID' });
    }

    // Perform deletion
    const result = await categoryColl.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error: any) {
    // Log the error for debugging
    console.error('Error deleting category:', error);

    res.status(500).json({ message: 'Error deleting category', error: error.message });
  }
};

export const addFieldToAllCategories = async (req: Request, res: Response) => {
  const { fieldName, fieldValue } = req.body;

  try {
    const result = await categoryColl.updateMany(
      {},
      { $set: { [fieldName]: fieldValue } }
    );

    res.status(200).json({ message: 'Field added to all categories', modifiedCount: result.modifiedCount });
  } catch (error: any) {
    // Log the error for debugging
    console.error('Error adding field to all categories:', error);

    res.status(500).json({ message: 'Error adding field to all categories', error: error.message });
  }
};

export const updateFieldInAllCategories = async (req: Request, res: Response) => {
  const { fieldName, newValue } = req.body;

  try {
    const result = await categoryColl.updateMany(
      {},
      { $set: { [fieldName]: newValue } }
    );

    res.status(200).json({ message: 'Field updated in all categories', modifiedCount: result.modifiedCount });
  } catch (error: any) {
    // Log the error for debugging
    console.error('Error updating field in all categories:', error);

    res.status(500).json({ message: 'Error updating field in all categories', error: error.message });
  }
};

export const deleteFieldFromAllCategories = async (req: Request, res: Response) => {
  const { fieldName } = req.body;

  try {
    const result = await categoryColl.updateMany(
      {},
      { $unset: { [fieldName]: "" } }
    );

    res.status(200).json({ message: 'Field deleted from all categories', modifiedCount: result.modifiedCount });
  } catch (error: any) {
    // Log the error for debugging
    console.error('Error deleting field from all categories:', error);

    res.status(500).json({ message: 'Error deleting field from all categories', error: error.message });
  }
};

export const addFieldToCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { fieldName, fieldValue } = req.body;

  try {
    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid category ID' });
    }

    const result = await categoryColl.updateOne(
      { _id: new ObjectId(id) },
      { $set: { [fieldName]: fieldValue } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({ message: 'Field added to category', modifiedCount: result.modifiedCount });
  } catch (error: any) {
    // Log the error for debugging
    console.error('Error adding field to category:', error);

    res.status(500).json({ message: 'Error adding field to category', error: error.message });
  }
};

export const updateFieldInCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { fieldName, newValue } = req.body;

  try {
    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid category ID' });
    }

    const result = await categoryColl.updateOne(
      { _id: new ObjectId(id) },
      { $set: { [fieldName]: newValue } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: 'Category not found or field not updated' });
    }

    res.status(200).json({ message: 'Field updated in category', modifiedCount: result.modifiedCount });
  } catch (error: any) {
    // Log the error for debugging
    console.error('Error updating field in category:', error);

    res.status(500).json({ message: 'Error updating field in category', error: error.message });
  }
};

export const deleteFieldFromCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { fieldName } = req.body;

  try {
    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid category ID' });
    }

    const result = await categoryColl.updateOne(
      { _id: new ObjectId(id) },
      { $unset: { [fieldName]: "" } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: 'Category not found or field not deleted' });
    }

    res.status(200).json({ message: 'Field deleted from category', modifiedCount: result.modifiedCount });
  } catch (error: any) {
    // Log the error for debugging
    console.error('Error deleting field from category:', error);

    res.status(500).json({ message: 'Error deleting field from category', error: error.message });
  }
};