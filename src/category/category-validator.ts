import {body} from "express-validator";

export default [
  body('name')
  .exists()
  .withMessage('Category name is required')
  .isString()
  .withMessage('Category name should be a string'),

  body('priceConfiguration')
  .exists()
  .withMessage('Price Configuration is required'),

  body('priceConfiguration.*.priceType')
  .exists()
  .withMessage('Price type is required')
  .custom((value:"base" | "aditional")=>{
    console.log(value);
    const validKeys=["base","aditional"]
    if(!validKeys.includes(value))
    {
      throw new Error(`${value} is invalid`);
    }
    return true;
  }),

  body('attributes')
  .exists()
  .withMessage('Attribute field is required'),


]

