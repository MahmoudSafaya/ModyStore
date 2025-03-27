import React, { useState, useEffect } from "react";
import { axiosAuth } from "../../api/axios";
import { Field, ErrorMessage } from "formik";
import { useApp } from "../../context/AppContext";
import Loading from "./Loading";

const JNTAddresses = ({ values, isSubmitting, parent, setFieldValue, handleBlur }) => {

  const [firstOptions, setFirstOptions] = useState([]);
  const [secondOptions, setSecondOptions] = useState([]);
  const [thirdOptions, setThirdOptions] = useState([]);

  const [firstSelection, setFirstSelection] = useState("");
  const [secondSelection, setSecondSelection] = useState("");
  const [thirdSelection, setThirdSelection] = useState("");

  const [showFirstOptions, setShowFirstOptions] = useState(false);
  const [showSecondOptions, setShowSecondOptions] = useState(false);
  const [showThirdOptions, setShowThirdOptions] = useState(false);

  const { setShippingPrice, senderAddress, fetchSenderAddress } = useApp();

  const [loading, setLoading] = useState(false);

  const [isEditable, setIsEditable] = useState({});

  const handleFocus = (field) => {
    setIsEditable((prev) => ({ ...prev, [field]: true })); // Enable field when focused
  };

  useEffect(() => {
    axiosAuth.post("/addresses/seprated")
      .then(response => setFirstOptions(response.data.data.result))
      .catch(error => console.error("Error fetching first options:", error));

    if (parent === 'sender') {
      fetchSenderAddress();
    }
  }, []);

  useEffect(() => {
    if (parent === 'sender' && senderAddress && Object.keys(senderAddress).length > 0) {
      values.sender = senderAddress;
      setFirstSelection(senderAddress.prov);
      setTimeout(() => {
        setSecondSelection(senderAddress.city);
      }, 300);
      setTimeout(() => {
        setThirdSelection(senderAddress.area);
      }, 600);
    }

    if (parent === 'receiver' && values.receiver) {
      setFirstSelection(values.receiver.prov);
      setTimeout(() => {
        setSecondSelection(values.receiver.city);
      }, 200);
      setTimeout(() => {
        setThirdSelection(values.receiver.area);
      }, 400);
    }
  }, [senderAddress]); // Wait for senderAddress to update


  useEffect(() => {
    if (isSubmitting) {
      setFirstSelection('');
    }
  }, [isSubmitting])

  useEffect(() => {
    if (firstSelection) {
      axiosAuth.post("/addresses/seprated", { Province: firstSelection })
        .then(response => {
          setSecondOptions(response.data.data.result);
          if (parent === 'receiver') {
            setShippingPrice(Number(response.data.data.price));
          }
        })
        .catch(error => console.error("Error fetching second options:", error));
    } else {
      setSecondOptions([]);
      setSecondSelection("");
    }
    setSecondSelection('');
    setThirdSelection('');
  }, [firstSelection]);

  useEffect(() => {
    if (secondSelection) {
      axiosAuth.post("/addresses/seprated", { Province: firstSelection, City: secondSelection })
        .then(response => setThirdOptions(response.data.data.result))
        .catch(error => console.error("Error fetching third options:", error));
    } else {
      setThirdOptions([]);
      setThirdSelection("");
    }
    setThirdSelection('');
  }, [secondSelection]);

  const handleInputBlue = (val, setVal, options) => {
    if (options.some(item => item === val)) {
      return false
    } else {
      setVal('');
    }
  }

  if (loading) return <Loading />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Name */}
      <div className="relative">
        <label className="custom-label-field" htmlFor={`${parent}.name`}>الاسم: <span className="text-red-500">*</span></label>

        <Field
          type="text"
          id={`${parent}.name`}
          name={`${parent}.name`}
          className="custom-input-field"
          placeholder="اكتب الاسم"
          autoComplete="off"
          readOnly={!isEditable[`${parent}.name`]}
          onFocus={() => handleFocus(`${parent}.name`)}
        />
        <ErrorMessage name={`${parent}.name`} component="div" className="text-red-400 text-xs absolute -bottom-5 right-1" />
      </div>

      {/* Mobile */}
      <div className="relative">
        <label className="custom-label-field" htmlFor={`${parent}.mobile`}>رقم الهاتف: <span className="text-red-500">*</span></label>
        <Field
          type="text"
          id={`${parent}.mobile`}
          name={`${parent}.mobile`}
          autoComplete="new-password"
          className="custom-input-field"
          placeholder="ادخل رقم موبيل"
        />
        <ErrorMessage name={`${parent}.mobile`} component="div" className="text-red-400 text-xs absolute -bottom-5 right-1" />
      </div>

      {/* Mobile */}
      <div className="relative">
        <label className="custom-label-field" htmlFor={`${parent}.alternateReceiverPhoneNo`}>رقم الهاتف 2: </label>
        <Field
          type="text"
          id={`${parent}.alternateReceiverPhoneNo`}
          name={`${parent}.alternateReceiverPhoneNo`}
          autoComplete="new-password"
          className="custom-input-field"
          placeholder="ادخل رقم موبيل اخر"
        />
        <ErrorMessage name={`${parent}.alternateReceiverPhoneNo`} component="div" className="text-red-400 text-xs absolute -bottom-5 right-1" />
      </div>

      {/* Province */}
      <div className="relative">
        <label className="custom-label-field" htmlFor={`${parent}.prov`}>
          المحافظة: <span className="text-red-500">*</span>
        </label>
        <Field
          type="text"
          id={`${parent}.prov`}
          name={`${parent}.prov`}
          placeholder="اسم المحافظة"
          className="custom-input-field"
          autoComplete="new-password"
          value={firstSelection}
          onChange={(e) => {
            setFirstSelection(e.target.value);
            setFieldValue(`${parent}.prov`, e.target.value); // Update form value
          }}
          onFocus={() => setShowFirstOptions(true)}
          onBlur={(e) => {
            handleBlur(e);
            handleInputBlue(firstSelection, setFirstSelection, firstOptions);
            setTimeout(() => setShowFirstOptions(false), 200);
          }}
        />
        <ErrorMessage
          name={`${parent}.prov`}
          component="div"
          className="text-red-400 text-xs absolute -bottom-5 right-1"
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
                    setFieldValue(`${parent}.prov`, option); // Update form value first
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
        <label className="custom-label-field" htmlFor={`${parent}.city`}>المدينة: <span className="text-red-500">*</span></label>
        <Field
          type="text"
          id={`${parent}.city`}
          name={`${parent}.city`}
          placeholder="اسم المدينة"
          autoComplete="new-password"
          className="custom-input-field"
          value={secondSelection}
          onChange={(e) => {
            setSecondSelection(e.target.value)
            setFieldValue(`${parent}.city`, e.target.value);
          }}
          onFocus={() => setShowSecondOptions(true)}
          onBlur={(e) => {
            handleBlur(e);
            handleInputBlue(secondSelection, setSecondSelection, secondOptions);
            setTimeout(() => setShowSecondOptions(false), 200);
          }}
          disabled={!firstSelection}
        />
        <ErrorMessage name={`${parent}.city`} component="div" className="text-red-400 text-xs absolute -bottom-5 right-1" />
        {showSecondOptions && (
          <ul className="absolute bg-white z-40 border border-gray-300 rounded-lg w-full mt-1 max-h-60 overflow-auto">
            {secondOptions.filter(item => item.includes(secondSelection)).map(option => (
              <li key={option} className="p-2 hover:bg-gray-200 cursor-pointer" onMouseDown={() => {
                setFieldValue(`${parent}.city`, option); // Update form value first
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
        <label className="custom-label-field" htmlFor={`${parent}.area`}>المنطقة: <span className="text-red-500">*</span></label>
        <Field
          type="text"
          id={`${parent}.area`}
          name={`${parent}.area`}
          placeholder="اسم المنظقة"
          autoComplete="new-password"
          className="custom-input-field"
          value={thirdSelection}
          onChange={(e) => {
            setThirdSelection(e.target.value)
            setFieldValue(`${parent}.area`, e.target.value);
          }}
          onFocus={() => setShowThirdOptions(true)}
          onBlur={(e) => {
            handleBlur(e);
            setTimeout(() => setShowThirdOptions(false), 200)
          }}
          disabled={!secondSelection}
        />
        <ErrorMessage name={`${parent}.area`} component="div" className="text-red-400 text-xs absolute -bottom-5 right-1" />
        {showThirdOptions && (
          <ul className="absolute bg-white z-40 border border-gray-300 rounded-lg w-full mt-1 max-h-60 overflow-auto">
            {thirdOptions.filter(item => item.includes(thirdSelection)).map(option => (
              <li key={option} className="p-2 hover:bg-gray-200 cursor-pointer" onMouseDown={() => {
                setFieldValue(`${parent}.area`, option); // Update form value first
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
      <div className="relative">
        <label className="custom-label-field" htmlFor={`${parent}.street`}>العنوان: <span className="text-red-500">*</span></label>
        <Field
          type="text"
          id={`${parent}.street`}
          name={`${parent}.street`}
          autoComplete="new-password"
          className="custom-input-field"
          placeholder="العنوان بالكامل"
        />
        <ErrorMessage name={`${parent}.street`} component="div" className="text-red-400 text-xs absolute -bottom-5 right-1" />
      </div>
    </div>
  )
}

export default JNTAddresses