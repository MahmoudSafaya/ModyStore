import * as Yup from 'yup';

export const newOrderSchema = Yup.object({
  sender: Yup.object({
    name: Yup.string().required("Enter Sender Name"),
    // email: Yup.string().email('Invalid email address').required('Sender Email is required'),
    phone1: Yup.string()
      .matches(/^\d{11}$/, "Phone number must be 10 digits")
      .required("Sender Phone is required"),
    phone2: Yup.string().matches(/^\d{11}$/, "Phone number must be 10 digits"),
    state: Yup.string().required("Enter Sender State"),
    city: Yup.string().required("Enter Sender City"),
    area: Yup.string().required("Enter Sender Area"),
    street: Yup.string().required("Enter Sender Street"),
  }),
  receiver: Yup.object({
    name: Yup.string().required("Enter Receiver Name"),
    // email: Yup.string().email('Invalid email address').required('Receiver Email is required'),
    phone1: Yup.string()
      .matches(/^\d{11}$/, "Phone number must be 10 digits")
      .required("Receiver Phone is required"),
    phone2: Yup.string().matches(/^\d{11}$/, "Phone number must be 10 digits"),
    state: Yup.string().required("Enter Receiver State"),
    city: Yup.string().required("Enter Receiver City"),
    area: Yup.string().required("Enter Receiver Area"),
    street: Yup.string().required("Enter Receiver Street"),
  }),
  product: Yup.object({
    name: Yup.string(),
    type: Yup.string(),
    quantity: Yup.number()
      .typeError("Quantity must be a number")
      .positive("Quantity must be positive")
      .required("Quantity is required"),
    weight: Yup.number()
      .typeError("Quantity must be a number")
      .positive("Quantity must be positive")
      .required("Quantity is required"),
    price: Yup.number()
      .typeError("Price must be a number")
      .positive("Price must be positive")
      .required("Price is required"),
  }),
});
