import { useEffect, useState } from 'react'
import { BadgePoundSterling, BadgePercent } from "lucide-react";
import { Field, ErrorMessage } from "formik";

const ProductPrice = ({ values, setFieldValue }) => {
    const [discount, setDiscount] = useState('none');
    const [actualPrice, setActualPrice] = useState();
    const [cutPrice, setCutPrice] = useState();

    useEffect(() => {
        if (discount === 'percentage') {
            const inPrcentage = values.price * (cutPrice / 100);
            setActualPrice(values.price - inPrcentage)
            setFieldValue('discount', cutPrice);
        } else if(discount === 'fixed-price') {
            const finalPrice = (cutPrice / values.price) * 100
            setActualPrice(values.price - cutPrice);
            setFieldValue('discount', finalPrice);
        }
    }, [cutPrice, values.price])

    return (
        <div className="custom-bg-white mt-8">
            <div className="custom-header">تسعير المنتج</div>
            <div className="flex flex-col gap-2">
                <label htmlFor="product-price" className="custom-label-field">السعر الرسمي</label>
                <Field name="price" type="number" id='product-price' className="custom-input-field" placeholder='اكتب السعر الأساسي للمنتج' />
                <ErrorMessage name="price" component="div" className="text-red-500" />
            </div>

            <div className="flex flex-col gap-2 my-8">
                <label htmlFor="product-price" className="custom-label-field"> نوع الخصم</label>
                <div className="flex justify-between items-center gap-4 flex-wrap">
                    <button type='button' className="flex grow justify-center items-center gap-2 border border-gray-300 rounded-lg p-4" onClick={() => setDiscount('none')}>
                        <span className={`w-5 h-5 rounded-full duration-500 ${discount === 'none' ? 'border-6 border-indigo-500' : 'border border-gray-300'}`}></span>
                        <span>بدون خصم</span>
                    </button>
                    <button type='button' className="flex grow justify-center items-center gap-2 border border-gray-300 rounded-lg p-4" onClick={() => setDiscount('percentage')}>
                        <span className={`w-5 h-5 rounded-full duration-500 ${discount === 'percentage' ? 'border-6 border-indigo-500' : 'border border-gray-300'}`}></span>
                        <span>نسبة محددة %</span>
                    </button>
                    <button type='button' className="flex grow justify-center items-center gap-2 border border-gray-300 rounded-lg p-4" onClick={() => setDiscount('fixed-price')}>
                        <span className={`w-5 h-5 rounded-full duration-500 ${discount === 'fixed-price' ? 'border-6 border-indigo-500' : 'border border-gray-300'}`}></span>
                        <span>سعر محدد $</span>
                    </button>
                </div>
            </div>
            {discount === 'percentage' && (
                <div>
                    <label htmlFor="discount-percentage" className="custom-label-field">إضافة نسبة الخصم</label>
                    <div className="relative">
                        <Field type="text" name="discount" id="discount-percentage" className="custom-input-field w-full" placeholder="(10, 15, 20, ...)" value={cutPrice} onChange={(e) => setCutPrice(e.target.value)} />
                        <BadgePercent className="w-20 h-full text-2xl p-2 rounded-l-lg bg-indigo-200 text-indigo-500 absolute top-0 left-0 border border-indigo-200" />
                    </div>
                    <ErrorMessage name='discount' component="div" className='text-red-400' />
                </div>
            )}
            {discount === 'fixed-price' && (
                <div>
                    <label htmlFor="discount-price" className="custom-label-field">خصم سعر محدد</label>
                    <div className="relative">
                        <Field type="text" name="discount" id="discount-price" className="custom-input-field w-full" placeholder="اكتب السعر المراد خصمه..." value={cutPrice} onChange={(e) => setCutPrice(e.target.value)} />
                        <BadgePoundSterling className="w-20 h-full text-2xl p-2 rounded-l-lg bg-indigo-200 text-indigo-500 absolute top-0 left-0 border border-indigo-200" />
                    </div>
                    <ErrorMessage name='discount' component="div" className='text-red-400' />
                </div>
            )}

            {discount !== 'none' && (
                <div className='w-full my-4'>
                    <p>Final price: </p>
                    <p>{actualPrice}</p>
                </div>
            )}
        </div>
    )
}

export default ProductPrice