
import * as Yup from "yup";

// Validation schema using Yup
export const visitorOrderSchema = Yup.object({
    receiver: Yup.object({
        name: Yup.string().required("هذا الحقل مطلوب"),
        mobile: Yup.string()
            .matches(/^\d{10,15}$/, "رقم هاتف غير صالح")
            .required("هذا الحقل مطلوب"),
        alternateReceiverPhoneNo: Yup.string()
            .matches(/^\d{10,15}$/, "رقم هاتف غير صالح"),
        prov: Yup.string().required("هذا الحقل مطلوب"),
        city: Yup.string().required("هذا الحقل مطلوب"),
        area: Yup.string().required("هذا الحقل مطلوب"),
        street: Yup.string().required("هذا الحقل مطلوب"),
        additionalInfo: Yup.string().max(500, "Maximum 500 characters allowed"),
    }),
});


// Validation schema using Yup
export const blockedAddress = Yup.object({

    Province: Yup.string().required("هذا الحقل مطلوب"),
    City: Yup.string().required("هذا الحقل مطلوب"),
    Area: Yup.string().required("هذا الحقل مطلوب"),

});