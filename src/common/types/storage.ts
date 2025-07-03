import { DeleteObjectCommandOutput } from "@aws-sdk/client-s3";

export interface FileData{
  filename:string;
  fileData:ArrayBuffer;
}

export interface FileStorage {
  upload(data:FileData):Promise<void>;
  delete(filename:string):Promise<DeleteObjectCommandOutput>;
  getObjectUri(filename:string):void;
}