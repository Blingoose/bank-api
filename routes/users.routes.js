import express from "express";
import { createUser, getAllUsers, getUserByID } from "../controllers/users.js";

const userRoutes = express.Router();

userRoutes.get("/", getAllUsers);
userRoutes.post("/", createUser);
userRoutes.get("/:id", getUserByID);

export default userRoutes;
