import React from "react";
import InputField from "./InputField";

const ReceiverForm = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      <InputField name='receiver.name' labelName='اسم العميل' requird='true' />
      <InputField name='receiver.phone1' labelName='رقم موبيل' requird='true' />
      <InputField name='receiver.phone2' labelName='رقم موبيل 2' />
      <InputField name='receiver.state' labelName='اسم المحافظه' requird='true' />
      <InputField name='receiver.city' labelName='اسم المركز' requird='true' />
      <InputField name='receiver.area' labelName='اسم المنطقه' requird='true' />
      <InputField name='receiver.street' labelName='اسم الشارع' requird='true' />
     
    </div>
  );
};

export default ReceiverForm;
