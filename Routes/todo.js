import express from "express";
import Todo from "../models/Todo.js";
import verifyToken from "../middleware/Auth.js";



const router = express.Router();
router.post('/create', verifyToken, async (req, res) => {
    const { title, description } = req.body;
    const userId = req.userId;

    const newTodo = new Todo({
        userId,
        title,
        description
    });

    try {
        const savedTodo = await newTodo.save();
        res.status(201).json(savedTodo);
    } catch (err) {
        res.status(500).json({ message: 'Error creating to-do item', error: err });
    }
});

// Get all To-Do items for the logged-in user
router.get('/', verifyToken, async (req, res) => {
    try {
        const todos = await Todo.find({ userId: req.userId });
        res.status(200).json(todos);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching to-do items', error: err });
    }
});

router.put('/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const { title, description, completed } = req.body;

    try {
        const updatedTodo = await Todo.findByIdAndUpdate(
            id,
            { title, description, completed },
            { new: true }
        );
        res.status(200).json(updatedTodo);
    } catch (err) {
        res.status(500).json({ message: 'Error updating to-do item', error: err });
    }
});

// Delete a To-Do item
router.delete('/:id', verifyToken, async (req, res) => {
    const { id } = req.params;

    try {
        await Todo.findByIdAndDelete(id);
        res.status(200).json({ message: 'To-Do item deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting to-do item', error: err });
    }
});

export default router;