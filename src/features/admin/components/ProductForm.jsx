import React from "react";
import InputField from "./InputField";

const ProductForm = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      
      <InputField name='product.name' labelName='اسم المنتج' />
      <InputField name='product.type' labelName='نوع المنتج' />
      <InputField name='product.weight' labelName='الوزن' requird='true' />
      <InputField name='product.quantity' labelName='الكمية' requird='true' />
      <InputField name='product.price' labelName='سعر الأوردر' requird='true' />
     
    </div>
  );
};

export default ProductForm;
