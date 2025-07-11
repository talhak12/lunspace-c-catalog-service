import mongoose from "mongoose";
import aggregatePagination from "mongoose-aggregate-paginate-v2";

const attributeValueSchema=new mongoose.Schema({
  name:{
    type:String
  },

  value:{
    type:mongoose.Schema.Types.Mixed,
  }
})

const priceConfigurationSchema=new mongoose.Schema({

  priceType:{
    type:String,
    enum:['base','aditional'],
    required:true
  },

  availableOptions:{
    type:Map,
    of:Number
  }



})

const productSchema=new mongoose.Schema({
  name:{
    type:String,
    required:true
  },

  description:{
    type:String,
    required:true
  },

  image:{
    type:String,
    required:true
  },

  priceConfiguration:
  {
    type:Map,
    of:priceConfigurationSchema
  },

  attributes:[attributeValueSchema],

  tenantId:{
    type:String,
    required:true

  },
  categoryId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Category"

  },
  isPublish:{
    type:Boolean,
    required:false,
    default:false
  }


},{timestamps:true});

productSchema.plugin(aggregatePagination);
export default mongoose.model("Product",productSchema);