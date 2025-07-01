import config from "config"
import express, { Request, Response } from "express";
import { globalErrorHandler } from "./common/middlewares/globalErrorHandler";
import CategoryRouter from './category/category-router'

const app = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    //res.send(config.get("server.port"));
    res.json({message:config.get("server.port")});
});

app.use("/categories",CategoryRouter)

app.use(globalErrorHandler);

export default app;
