import { useState } from 'react'
import { BadgePoundSterling, BadgePercent } from "lucide-react";

const ProductPrice = () => {
    const [discount, setDiscount] = useState('none');

    return (
        <div className="custom-bg-white mt-8">
            <div className="custom-header">تسعير المنتج</div>
            <div className="flex flex-col gap-2">
                <label htmlFor="product-price" className="custom-label-field">السعر الرسمي</label>
                <input type="text" name='product-price' id='product-price' placeholder='اكتب السعر الأساسي للمنتج'
                    className="custom-input-field" />
            </div>
            <div className="flex flex-col gap-2 my-8">
                <label htmlFor="product-price" className="custom-label-field"> نوع الخصم</label>
                <div className="flex justify-between items-center gap-4 flex-wrap">
                    <button className="flex grow justify-center items-center gap-2 border border-gray-300 rounded-lg p-4" onClick={() => setDiscount('none')}>
                        <span className={`w-5 h-5 rounded-full duration-500 ${discount === 'none' ? 'border-6 border-indigo-500' : 'border border-gray-300'}`}></span>
                        <span>بدون خصم</span>
                    </button>
                    <button className="flex grow justify-center items-center gap-2 border border-gray-300 rounded-lg p-4" onClick={() => setDiscount('percentage')}>
                        <span className={`w-5 h-5 rounded-full duration-500 ${discount === 'percentage' ? 'border-6 border-indigo-500' : 'border border-gray-300'}`}></span>
                        <span>نسبة محددة %</span>
                    </button>
                    <button className="flex grow justify-center items-center gap-2 border border-gray-300 rounded-lg p-4" onClick={() => setDiscount('fixed-price')}>
                        <span className={`w-5 h-5 rounded-full duration-500 ${discount === 'fixed-price' ? 'border-6 border-indigo-500' : 'border border-gray-300'}`}></span>
                        <span>سعر محدد $</span>
                    </button>
                </div>
            </div>
            {discount === 'percentage' && (
                <div>
                    <label htmlFor="discount-percentage" className="custom-label-field">إضافة نسبة الخصم</label>
                    <div className="relative">
                        <input type="text" name="discount-percentage" id="discount-percentage" className="custom-input-field w-full" placeholder="(10, 15, 20, ...)" />
                        <BadgePercent className="w-20 h-full text-2xl p-2 rounded-l-lg bg-indigo-200 text-indigo-500 absolute top-0 left-0 border border-indigo-200" />
                    </div>
                </div>
            )}
            {discount === 'fixed-price' && (
                <div>
                    <label htmlFor="discount-price" className="custom-label-field">خصم سعر محدد</label>
                    <div className="relative">
                        <input type="text" name="discount-price" id="discount-price" className="custom-input-field w-full" placeholder="اكتب السعر المراد خصمه..." />
                        <BadgePoundSterling className="w-20 h-full text-2xl p-2 rounded-l-lg bg-indigo-200 text-indigo-500 absolute top-0 left-0 border border-indigo-200" />
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProductPrice