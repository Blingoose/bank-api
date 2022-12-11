import express from "express";
import actionRoutes from "./actions.routes.js";
import userRoutes from "./users.routes.js";

const router = express.Router();

router.use("/users", userRoutes);
router.use("/actions/", actionRoutes);

export default router;
