import express from "express";
import { actions } from "../controllers/actions.js";

const actionRoutes = express.Router();

actionRoutes.put("/", actions);

export default actionRoutes;
