import * as Yup from 'yup';

export const ProductSchema = Yup.object().shape({
    name: Yup.string().required("Product name is required"),
    description: Yup.string().required('shit here'),
    price: Yup.number().positive("Price must be positive").required("Price is required"),
    discount: Yup.number(),
    category: Yup.string().required("Category is required"),
    badge: Yup.string(),
    mainImage: Yup.mixed().required("An image is required"),
    images: Yup.mixed().required("At least one image is required"),
    isActive: Yup.boolean(),
    variants: Yup.array().of(
        Yup.object().shape({
            color: Yup.string(),
            size: Yup.string(),
            stock: Yup.number().min(0, "Additional price must be at least 0").required('this is required'),
        })
    ),
    reviews: Yup.array().of(
        Yup.object().shape({
            rating: Yup.number().integer("Stock must be an integer"),
            comment: Yup.string(),
        })
    ),
});