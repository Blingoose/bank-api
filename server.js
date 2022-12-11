import express from "express";
import cors from "cors";
import router from "./routes/Router.js";

const server = express();
server.use(cors());
server.use(express.json());

server.use("/", router);

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
