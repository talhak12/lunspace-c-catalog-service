import { NextFunction, Request,Response } from "express";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import { CategoryService } from "./category-service";
import { Logger } from "winston";

export class CategoryController{

  constructor(private categoryService:CategoryService,private logger:Logger){
    this.create=this.create.bind(this);
    //this.logger=this.logger.bind(this);
  }

  async create(req:Request,res:Response,next:NextFunction){

    const result=validationResult(req);

    if(!result.isEmpty())
    {
      console.log(result.array());
      return next(createHttpError(400,result.array()[0].msg as string))
    }

    const {name,priceConfiguration,attributes}=req.body;

    //Call the service
    const category=await this.categoryService.create({
      name,priceConfiguration,attributes
    });
    console.log(this.logger);
    this.logger.info(`Created category`)

    res.json({id:category._id});
  }

}