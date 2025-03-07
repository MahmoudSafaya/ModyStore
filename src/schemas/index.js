import * as Yup from 'yup';

export const newOrderSchema = Yup.object({
  sender: Yup.object({
    name: Yup.string().required("ادخل اسم الراسل"),
    // email: Yup.string().email('Invalid email address').required('Sender Email is required'),
    mobile: Yup.string()
      .matches(/^\d{10,15}$/, "رقم هاتف غير صالح")
      .required("هذا الحقل مطلوب"),
    alternateReceiverPhoneNo: Yup.string()
      .matches(/^\d{10,15}$/, "رقم هاتف غير صالح"),
    prov: Yup.string().required("ادخل اسم المحاقظة"),
    city: Yup.string().required("ادخل اسم المدينة"),
    area: Yup.string().required("ادخل اسم المنطقة"),
    street: Yup.string().required("ادخل عنوان الراسل"),
  }),
  receiver: Yup.object({
    name: Yup.string().required("ادخل اسم العميل"),
    // email: Yup.string().email('Invalid email address').required('Receiver Email is required'),
    mobile: Yup.string()
      .matches(/^\d{10,15}$/, "رقم هاتف غير صالح")
      .required("هذا الحقل مطلوب"),
    alternateReceiverPhoneNo: Yup.string()
      .matches(/^\d{10,15}$/, "رقم هاتف غير صالح"),
    prov: Yup.string().required("ادخل اسم المحاقظة"),
    city: Yup.string().required("ادخل اسم المدينة"),
    area: Yup.string().required("ادخل اسم المنطقة"),
    street: Yup.string().required("ادخل عنوان العميل"),
  }),
  items: Yup.array().of(
    Yup.object({
      englishName: Yup.string(),
      itemType: Yup.string(),
      itemValue: Yup.number()
        .typeError("السعر يجب ان يكون رقم")
        .positive("ادخل رقم صحيح")
    }),
  ),
  itemsValue: Yup.string().required('سعر الأوردر الإجمالى مطلوب'),
  goodsType: Yup.string(),
  remark: Yup.string()
    .max(500, 'الوصف يجب ألا يزيد علي 500 حرف')
});

export const visitorOrder = Yup.object({
  receiver: Yup.object({
    name: Yup.string().required("املأ هذا الحقل"),
    mobile: Yup.string()
      .matches(/^\d{11}$/, "ادخل رقم هاتف صحيح")
      .required("املأ هذا الحقل"),
    phone2: Yup.string().matches(/^\d{11}$/, "ادخل رقم هاتف صحيح"),
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