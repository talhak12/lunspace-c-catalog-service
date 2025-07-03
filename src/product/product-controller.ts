import { NextFunction, Response } from "express";
import { Request } from "express-jwt";
import {v4 as uuidv4} from "uuid";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import { ProductService } from "./product-service";
import { Filter, Product } from "./product-types";
import { FileStorage } from "../common/types/storage";
import { UploadedFile } from "express-fileupload";
import { AuthRequest } from "../common/types";
import { Roles } from "../common/constants";
import mongoose from "mongoose";

export class ProductController
{
  
   constructor(private productService:ProductService,
    private storage:FileStorage){}
   create=async (req:Request,res:Response,next:NextFunction) =>
  {
    const result=validationResult(req);

    console.log("req",req.body);
    
        if(!result.isEmpty())
        {
          console.log(result.array());
          return next(createHttpError(400,result.array()[0].msg as string))
        }

        const image=req.files!.image as UploadedFile;
        const imageName=uuidv4();

        await this.storage.upload({
          filename:imageName,
          fileData:image.data
        })

        const {name,description,
          priceConfiguration,attributes,
          tenantId,categoryId,isPublish}=req.body;

          const product={
            name,
            description,
            priceConfiguration:JSON.parse(priceConfiguration as string),
            attributes:JSON.parse(attributes as string),
            tenantId,
            categoryId,
            isPublish,
            image:imageName
          }

        const newProduct = await 
        this.productService.createProduct(product as Product);

        res.json({id:newProduct._id});
  }

   update=async (req:Request,res:Response,next:NextFunction) =>
  {
    const result=validationResult(req);
    console.log("req",req.body);

    const {productId}=req.params;

    const product = await this.productService.getProduct(productId);

    if(!product)
    {
      return next(createHttpError(404,"Product not found"));
    }

    if(req.auth?.role!=(Roles.ADMIN as string) )
    {
        const tenant=(req as AuthRequest).auth.tenant;

        console.log('product.tenantId',product.tenantId);
        console.log('tenant',String(tenant));

    if(product.tenantId!=String(tenant))
    {
      return next(createHttpError(404,
        "You are not allowed to access the product"));
    }
    }
    


    let imageName:string | undefined;
    let oldImage :string | undefined;


    if(req.files?.image)
    {
      oldImage=product.image;

      const image=req.files!.image as UploadedFile;
      imageName=uuidv4();

        await this.storage.upload({
          filename:imageName,
          fileData:image.data
        })

        await this.storage.delete(oldImage!);
    }

    const {name,description,
          priceConfiguration,attributes,
          tenantId,categoryId,isPublish}=req.body;

          const productToUpdate={
            name,
            description,
            priceConfiguration:JSON.parse(priceConfiguration as string),
            attributes:JSON.parse(attributes as string),
            tenantId,
            categoryId,
            isPublish,
            image:imageName?imageName : (oldImage as string)
          }

    await this.productService.
    updateProduct(productId,productToUpdate);

    res.json({id:productId});
    

  }

  index=async(req:Request,res:Response,next:NextFunction)=>{
    const {q,tenantId,categoryId,isPublish}=req.query;

    const filters:Filter={};

    console.log('isPublish',isPublish,typeof isPublish);


    if(isPublish==="true")
    {
      console.log('bhund');
      filters.isPublish=true;
    }
    

    if(tenantId){
      filters.tenantId=tenantId as string;
    }

    if(categoryId && 
      mongoose.Types.ObjectId.isValid(categoryId as string))
    {
      
      filters.categoryId=new 
      mongoose.Types.ObjectId(categoryId as string)
    }

    console.log(filters);
    const products = await this.productService.
    getProducts(q as string,filters);

    res.json({products})

  }



}