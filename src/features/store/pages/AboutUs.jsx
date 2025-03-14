import React from 'react';

const AboutUs = () => {
    return (
        <div className="bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full md:max-w-5/6 mx-auto custom-bg-white">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">من نحن</h1>

                <div className="space-y-6 text-gray-700">
                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">عن المتجر</h2>
                        <p className="leading-relaxed">
                            مرحبًا بكم في متجرنا الإلكتروني! نحن نقدم لكم تشكيلة واسعة من المنتجات التي تلبي احتياجاتكم اليومية، تشمل ملابس رجالية، ملابس حريمي، ملابس أطفال، شنط، إلكترونيات، والعديد من المنتجات الأخرى. نسعى دائمًا لتقديم أفضل جودة وأحدث الصيحات بأسعار تنافسية.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">سياسة الشحن</h2>
                        <p className="leading-relaxed">
                            نحرص على توصيل طلباتكم في أسرع وقت ممكن. يتم الشحن خلال 2-5 أيام عمل حسب الموقع. نقدم أيضًا خدمة التتبع للطلبات حتى تصل إليكم بأمان. متاح الشحن لجميع أنحاء جمهورية مصر العربية. بالنسبة للشحن الدولي، قد تستغرق الطلبات وقتًا أطول حسب الوجهة.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">سياسة الاسترجاع والاستبدال</h2>
                        <p className="leading-relaxed">
                            إذا لم تكن راضيًا عن منتجك لأي سبب، يمكنك استرجاعه أو استبداله خلال 14 يومًا من تاريخ الاستلام. يرجى التأكد من أن المنتج في حالته الأصلية وبعبواته الأصلية. لمعرفة المزيد عن عملية الاسترجاع، يرجى التواصل مع خدمة العملاء.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">لماذا تختارنا؟</h2>
                        <ul className="list-disc list-inside space-y-2">
                            <li>تشكيلة واسعة من المنتجات بأسعار تنافسية.</li>
                            <li>خدمة عملاء متاحة على مدار الساعة لمساعدتكم.</li>
                            <li>شحن سريع وآمن لجميع أنحاء العالم.</li>
                            <li>سياسة استرجاع مرنة لضمان رضاكم التام.</li>
                        </ul>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;