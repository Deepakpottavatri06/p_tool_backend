import express, { urlencoded } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Signup from './Routes/Signup.js';
import Login from './Routes/Login.js';
import cors from "cors";
import todoRoutes from './Routes/todo.js';
import SubsId from './Routes/SubsId.js';


dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;
const uri = process.env.MONGO_URI;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => { console.log("Connected to MongoDB") })
    .catch((err) => {
        console.log(err);
        return res.status(500).json({ "message": "Server Error" });
    });

app.use("/api", Signup);
app.use("/api", Login);
app.use('/api/todos', todoRoutes);
app.use("/api/subid", SubsId);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});