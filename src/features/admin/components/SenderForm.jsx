import React from "react";
import InputField from "./InputField";

const SenderForm = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      <InputField name='sender.name' labelName='اسم الراسل' requird='true' />
      <InputField name='sender.mobile' labelName='رقم الهاتف' requird='true' />
      <InputField name='sender.phone2' labelName='رقم الهاتف 2' />
      <InputField name='sender.prov' labelName='اسم المحافظه' requird='true' />
      <InputField name='sender.city' labelName='اسم المركز' requird='true' />
      <InputField name='sender.area' labelName='اسم المنطقه' requird='true' />
      <InputField name='sender.street' labelName='اسم الشارع' requird='true' />
     
    </div>
  );
};

export default SenderForm;
