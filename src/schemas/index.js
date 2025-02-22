import * as Yup from 'yup';

export const newOrderSchema = Yup.object({
  sender: Yup.object({
    name: Yup.string().required("Enter Sender Name"),
    // email: Yup.string().email('Invalid email address').required('Sender Email is required'),
    mobile: Yup.string()
      .matches(/^\d{10,15}$/, "رقم هاتف غير صالح")
      .required("هذا الحقل مطلوب"),
    prov: Yup.string().required("Enter Sender prov"),
    city: Yup.string().required("Enter Sender City"),
    area: Yup.string().required("Enter Sender Area"),
    street: Yup.string().required("Enter Sender Street"),
  }),
  receiver: Yup.object({
    name: Yup.string().required("Enter Receiver Name"),
    // email: Yup.string().email('Invalid email address').required('Receiver Email is required'),
    mobile: Yup.string()
      .matches(/^\d{10,15}$/, "رقم هاتف غير صالح")
      .required("هذا الحقل مطلوب"),
    prov: Yup.string().required("Enter Receiver prov"),
    city: Yup.string().required("Enter Receiver City"),
    area: Yup.string().required("Enter Receiver Area"),
    street: Yup.string().required("Enter Receiver Street"),
  }),
  items: Yup.array().of(
    Yup.object({
      englishName: Yup.string(),
      itemType: Yup.string(),
      itemValue: Yup.number()
        .typeError("Price must be a number")
        .positive("Price must be positive")
        .required("Price is required"),
    }),
  )
});

export const visitorOrder = Yup.object({
  receiver: Yup.object({
    name: Yup.string().required("املأ هذا الحقل"),
    mobile: Yup.string()
      .matches(/^\d{11}$/, "ادخل رقم هاتف صحيح")
      .required("املأ هذا الحقل"),
    phone2: Yup.string().matches(/^\d{11}$/, "Phone number must be 10 digits"),
    prov: Yup.string().required("املأ هذا الحقل"),
    city: Yup.string().required("املأ هذا الحقل"),
    area: Yup.string().required("املأ هذا الحقل"),
    street: Yup.string().required("املأ هذا الحقل"),
    company: Yup.string(),
    postCode: Yup.string(),
    address: Yup.string(),
    addressBak: Yup.string(),
    town: Yup.string(),
    mailBox: Yup.string(),
    phone: Yup.string(),
    countryCode: Yup.string(),
    alternateReceiverPhoneNo: Yup.string(),
    areaCode: Yup.string(),
    building: Yup.string(),
    floor: Yup.string(),
    flats: Yup.string(),
  }),
});