import * as Yup from 'yup';

export const ProductSchema = Yup.object().shape({
    name: Yup.string().required('هذا الحقل مطلوب'),
    description: Yup.string().required('هذا الحقل مطلوب'),
    price: Yup.number().positive("ادخل رقم صحيح").required('هذا الحقل مطلوب'),
    discount: Yup.number(),
    category: Yup.string().required('هذا الحقل مطلوب'),
    badge: Yup.string(),
    mainImage: Yup.mixed().required('هذا الحقل مطلوب'),
    images: Yup.mixed().required("أضف صورة واحدة علي الأقل"),
    isActive: Yup.boolean(),
    variants: Yup.array().of(
        Yup.object().shape({
            color: Yup.string().required('هذا الحقل مطلوب'),
            size: Yup.string().required('هذا الحقل مطلوب'),
            stock: Yup.number().min(1, "الكمية يجب ألا تقل عن 1").required('هذا الحقل مطلوب'),
        })
    ),
    reviews: Yup.array().of(
        Yup.object().shape({
            rating: Yup.number().integer("ادخل رقم صحيح"),
            comment: Yup.string(),
        })
    ),
});