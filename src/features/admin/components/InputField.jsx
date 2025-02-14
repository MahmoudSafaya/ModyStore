import { Field, ErrorMessage } from "formik";

const InputField = ({ name, labelName, requird }) => {
    return (
      <div className="flex flex-col gap-2">
        <label htmlFor={name} className="text-gray-500 cursor-pointer">{labelName}:{requird ? <span className="requird-tag">*</span> : ""}</label>
        <Field name={name} id={name} placeholder={labelName} className="custom-input-field text-gray-800" />
        <ErrorMessage
          name={name}
          component="div"
          style={{ color: "red" }}
        />
      </div>
    );
  };
  
  export default InputField;
  