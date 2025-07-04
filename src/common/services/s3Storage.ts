import { DeleteObjectCommand, DeleteObjectCommandOutput, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { FileData, FileStorage } from "../types/storage";
import  config  from 'config'
import createHttpError from "http-errors";

export class S3Storage implements FileStorage{
  
  private client:S3Client;

  constructor(){
    this.client=new S3Client({
      region:config.get("s3.region"),
      credentials:{
        accessKeyId:config.get("s3.accessKeyId"),
        secretAccessKey:config.get("s3.secretAccessKey")
      }
    })
  }

  async upload(data: FileData): Promise<void> {
    const buffer = Buffer.from(data.fileData);
    const objectParams={
      Bucket:config.get("s3.bucket") as string,
      Key:data.filename as string,
      Body:buffer//data.fileData
    };

    await this.client.send(new PutObjectCommand(objectParams));
  }
  async delete(filename:string): Promise<DeleteObjectCommandOutput> {

    const objectParams={
      Bucket:config.get("s3.bucket") as string,
      Key:filename,
      
    };

    return await this.client.send(new DeleteObjectCommand(objectParams));
  }
  getObjectUri(filename: string): string {

    const bucket=config.get("s3.bucket");
    const region=config.get("s3.region");

    if(typeof bucket==="string" && typeof region==="string")
    {
       return `https://${bucket}.s3.${region}.amazonaws.com/${filename}`
    }
    const error=createHttpError(500,"Invalid S3 configuration");
    throw error;
  
  }

  



}