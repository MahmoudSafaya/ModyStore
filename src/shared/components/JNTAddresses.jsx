import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import { Field, ErrorMessage } from "formik";

const JNTAddresses = ({ setFieldValue, handleBlur }) => {

  const [firstOptions, setFirstOptions] = useState([]);
  const [secondOptions, setSecondOptions] = useState([]);
  const [thirdOptions, setThirdOptions] = useState([]);

  const [firstSelection, setFirstSelection] = useState("");
  const [secondSelection, setSecondSelection] = useState("");
  const [thirdSelection, setThirdSelection] = useState("");

  const [showFirstOptions, setShowFirstOptions] = useState(false);
  const [showSecondOptions, setShowSecondOptions] = useState(false);
  const [showThirdOptions, setShowThirdOptions] = useState(false);

  useEffect(() => {
    axios.post("/addresses/seprated")
      .then(response => setFirstOptions(response.data.data))
      .catch(error => console.error("Error fetching first options:", error));
  }, []);

  useEffect(() => {
    if (firstSelection) {
      axios.post("/addresses/seprated", { Province: firstSelection })
        .then(response => setSecondOptions(response.data.data))
        .catch(error => console.error("Error fetching second options:", error));
    } else {
      setSecondOptions([]);
      setSecondSelection("");
    }
  }, [firstSelection]);

  useEffect(() => {
    if (secondSelection) {
      axios.post("/addresses/seprated", { Province: firstSelection, City: secondSelection })
        .then(response => setThirdOptions(response.data.data))
        .catch(error => console.error("Error fetching third options:", error));
    } else {
      setThirdOptions([]);
      setThirdSelection("");
    }
  }, [secondSelection]);

  useEffect(() => {
    setSecondSelection('');
    setThirdSelection('');
  }, [firstSelection]);

  useEffect(() => {
    setThirdSelection('');
  }, [secondSelection]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Name */}
      <div>
        <label className="custom-label-field">الاسم <span className="text-red-500">*</span></label>
        <Field
          type="text"
          name="receiver.name"
          className="custom-input-field"
          placeholder="Enter receiver's name"
        />
        <ErrorMessage name="receiver.name" component="div" className="text-red-400 mt-1 text-sm" />
      </div>

      {/* Mobile */}
      <div>
        <label className="custom-label-field">رقم الهاتف <span className="text-red-500">*</span></label>
        <Field
          type="text"
          name="receiver.mobile"
          className="custom-input-field"
          placeholder="Enter mobile number"
        />
        <ErrorMessage name="receiver.mobile" component="div" className="text-red-400 mt-1 text-sm" />
      </div>

      {/* Province */}
      <div className="relative">
        <label className="custom-label-field">
          المحافظة <span className="text-red-500">*</span>
        </label>
        <Field
          type="text"
          name="receiver.prov"
          placeholder="Enter prov"
          className="custom-input-field"
          value={firstSelection}
          onChange={(e) => {
            setFirstSelection(e.target.value);
            setFieldValue("receiver.prov", e.target.value); // Update form value
          }}
          onFocus={() => setShowFirstOptions(true)}
          onBlur={(e) => {
            handleBlur(e);
            setTimeout(() => setShowFirstOptions(false), 200);
          }}
        />
        <ErrorMessage
          name="receiver.prov"
          component="div"
          className="text-red-400 mt-1 text-sm"
        />
        {showFirstOptions && (
          <ul className="absolute bg-white z-40 border border-gray-300 rounded-lg w-full mt-1 max-h-60 overflow-auto">
            {firstOptions
              .filter((item) => item.includes(firstSelection))
              .map((option) => (
                <li
                  key={option}
                  className="p-2 hover:bg-gray-200 cursor-pointer"
                  onMouseDown={() => {
                    setFieldValue("receiver.prov", option); // Update form value first
                    setFirstSelection(option); // Update local state
                    setShowFirstOptions(false); // Hide dropdown
                  }}
                >
                  {option}
                </li>
              ))}
          </ul>
        )}
      </div>

      {/* City */}
      <div className="relative">
        <label className="custom-label-field">المدينة <span className="text-red-500">*</span></label>
        <Field
          type="text"
          name="receiver.city"
          placeholder="Enter city"
          className="custom-input-field"
          value={secondSelection}
          onChange={(e) => {
            setSecondSelection(e.target.value)
            setFieldValue("receiver.city", e.target.value);
          }}
          onFocus={() => setShowSecondOptions(true)}
          onBlur={(e) => {
            handleBlur(e);
            setTimeout(() => setShowSecondOptions(false), 200)
          }}
          disabled={!firstSelection}
        />
        <ErrorMessage name="receiver.city" component="div" className="text-red-400 mt-1 text-sm" />
        {showSecondOptions && (
          <ul className="absolute bg-white z-40 border border-gray-300 rounded-lg w-full mt-1 max-h-60 overflow-auto">
            {secondOptions.filter(item => item.includes(secondSelection)).map(option => (
              <li key={option} className="p-2 hover:bg-gray-200 cursor-pointer" onMouseDown={() => {
                setFieldValue("receiver.city", option); // Update form value first
                setSecondSelection(option); // Update local state
                setShowSecondOptions(false); // Hide dropdown
              }}>
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Area */}
      <div className="relative">
        <label className="custom-label-field">المنطقة <span className="text-red-500">*</span></label>
        <Field
          type="text"
          name="receiver.area"
          placeholder="Enter area"
          className="custom-input-field"
          value={thirdSelection}
          onChange={(e) => {
            setThirdSelection(e.target.value)
            setFieldValue("receiver.area", e.target.value);
          }}
          onFocus={() => setShowThirdOptions(true)}
          onBlur={(e) => {
            handleBlur(e);
            setTimeout(() => setShowThirdOptions(false), 200)
          }}
          disabled={!secondSelection}
        />
        <ErrorMessage name="receiver.area" component="div" className="text-red-400 mt-1 text-sm" />
        {showThirdOptions && (
          <ul className="absolute bg-white z-40 border border-gray-300 rounded-lg w-full mt-1 max-h-60 overflow-auto">
            {thirdOptions.filter(item => item.includes(thirdSelection)).map(option => (
              <li key={option} className="p-2 hover:bg-gray-200 cursor-pointer" onMouseDown={() => {
                setFieldValue("receiver.area", option); // Update form value first
                setThirdSelection(option); // Update local state
                setShowThirdOptions(false); // Hide dropdown
              }}>
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Street */}
      <div>
        <label className="custom-label-field">الشارع <span className="text-red-500">*</span></label>
        <Field
          type="text"
          name="receiver.street"
          className="custom-input-field"
          placeholder="Enter street"
        />
        <ErrorMessage name="receiver.street" component="div" className="text-red-400 mt-1 text-sm" />
      </div>
    </div>
  )
}

export default JNTAddresses