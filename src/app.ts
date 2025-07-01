import config from "config"
import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import { globalErrorHandler } from "./common/middlewares/globalErrorHandler";
import CategoryRouter from './category/category-router';
import ProductRouter from './product/product-router';


const app = express();

app.use(express.json());
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
    //res.send(config.get("server.port"));
    res.json({message:config.get("server.port")});
});


app.use("/categories",CategoryRouter);
app.use("/products",ProductRouter);

app.use(globalErrorHandler);

export default app;
