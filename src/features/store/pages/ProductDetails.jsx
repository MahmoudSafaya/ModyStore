import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCart } from "../../../context/CartContext";
import { useEffect } from "react";
import { axiosMain } from "../../../api/axios";
import DOMPurify from 'dompurify';
import Loading from "../../../shared/components/Loading";
import toast, { Toaster } from "react-hot-toast";
import { FaStar } from "react-icons/fa";
import { Helmet } from "react-helmet-async";
import ImageGallery from "../components/ImageGallery";
import { MdLocalShipping } from "react-icons/md";

const ProductDetails = ({ }) => {
    const { addToCart } = useCart();
    const [product, setProduct] = useState();
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);

    const [proVariants, setProVariants] = useState([]);
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [selectedVariant, setSelectedVariant] = useState({ size: '', color: '' });
    const [newReview, setNewReview] = useState({ name: "", rating: 0, comment: "" });
    const [reviewDone, setReviewDone] = useState(false);

    const [finalVariant, setFinalVariant] = useState('');

    const baseUrl = import.meta.env.VITE_SERVER_URL;
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const getProductById = async () => {
            setLoading(true);
            try {
                const res = await axiosMain.get(`/products/${id}`);
                const data = res.data;
                setProduct(data)
                setProVariants(data.variants);
                if (data.variants.length === 1) {
                    setSelectedVariant(`${data.name} ${data.variants[0].color} (${data.variants[0].size})`);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false)
            }
        }

        getProductById();
    }, [id]);

    const handleSelectVariant = (key, value, proName) => {
        if (availableSizes.length === 1) {
            setSelectedVariant(prev => ({
                ...prev,
                size: availableSizes[0]
            }))
        } else if (availableColors.length === 1) {
            setSelectedVariant(prev => ({
                ...prev,
                color: availableColors[0]
            }))
        }
        setSelectedVariant(prev => ({
            ...prev,
            productName: proName,
            [key]: prev[key] && prev[key] === value ? '' : value, // Toggle selection
        }));

    };

    useEffect(() => {
        if (selectedVariant.size && selectedVariant.color) {
            setFinalVariant(`${selectedVariant.productName} ${selectedVariant.color} (${selectedVariant.size})`)
        }
    }, [selectedVariant])

    // Get unique sizes and colors
    const variantSizes = proVariants
        .filter((v) => v.stock > 0 && v.size) // Ensure size exists and stock is available
        .map((v) => v.size); // Extract size values
    const availableSizes = variantSizes[0] !== 'undefined' ? [...new Set(variantSizes)] : []; // Get unique sizes

    const variantColors = proVariants
        .filter((v) => v.stock > 0 && v.color) // Ensure color exists and stock is available
        .map((v) => v.color); // Extract color values
    const availableColors = variantColors[0] !== 'undefined' ? [...new Set(variantColors)] : []; // Get unique colors

    // Determine visibility logic
    // Set 1 to 0 to display the single variant
    const hasMultipleSizes = availableSizes.length > 1;
    const hasMultipleColors = availableColors.length > 1;

    // Filter colors based on selected size
    const filteredColors = selectedSize
        ? [
            ...new Set(
                proVariants
                    .filter(
                        (v) => v.size === selectedSize && v.stock > 0 && v.color
                    )
                    .map((v) => v.color)
            ),
        ]
        : availableColors;

    // Filter sizes based on selected color
    const filteredSizes = selectedColor
        ? [
            ...new Set(
                proVariants
                    .filter(
                        (v) => v.color === selectedColor && v.stock > 0 && v.size
                    )
                    .map((v) => v.size)
            ),
        ]
        : availableSizes;

    const increaseQty = () => {
        // const totalStock = proVariants.reduce((total, item) => total + item.stock, 0);
        // if (quantity < totalStock) {
        setQuantity(quantity + 1)
        // } else {
        //     toast('عفوا, الكمية المطلوبة لست متوفرة في الوقت الحالي.', {
        //         style: {
        //             textAlign: 'center'
        //         }
        //     })
        // }
    };
    const decreaseQty = () => setQuantity(quantity > 1 ? quantity - 1 : 1);

    const handleBuyNow = (product, quantity) => {
        if (product.variants.length <= 1) {
            addToCart(true, product, quantity);
            navigate('/checkout');
        } else if (finalVariant) {
            addToCart(true, product, quantity, finalVariant);
            navigate('/checkout');
        } else {
            toast(
                "من فضلك, اختر مقاس أو لون مناسب لك أولاً.",
                {
                    duration: 3000,
                    style: {
                        textAlign: 'center',
                    },
                }
            );
            return false;
        }
    }

    // Reviews Section
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewReview({ ...newReview, [name]: value });
    };

    const handleRatingChange = (rating) => {
        setNewReview({ ...newReview, rating });
    };

    const submitReview = async (e, productId) => {
        e.preventDefault();
        if (newReview.name && newReview.rating > 0 && newReview.comment) {
            await axiosMain.post(`/products/${productId}/reviews`, newReview);
            setNewReview({ name: "", rating: 0, comment: "" });
            toast.success('شكرًا جزيلاً لك على مراجعتك القيّمة.', {
                style: {
                    textAlign: 'center'
                }
            })
        }
    };

    if (loading) {
        return <Loading />
    }

    return (
        <div className="pt-12 px-6 md:px-12 text-gray-800">
            {product && (
                <div>
                    <Helmet>
                        <title>{`${product.name} - Diva Store`}</title>
                        <meta name="description" content={product.description} />
                        <meta name="keywords" content={`buy ${product.name}, e-commerce, Diva Store`} />

                        {/* Open Graph for social sharing */}
                        <meta property="og:title" content={`${product.name} | Diva Store`} />
                        <meta property="og:description" content={product.description} />
                        <meta property="og:image" content={encodeURI(`${baseUrl}/${product.mainImage.url.replace(/\\/g, '/')}`)} />
                        <meta property="og:url" content={`https://divastore.com/products/${product._id}`} />
                        <meta property="og:type" content="product" />

                        {/* Twitter Card */}
                        <meta name="twitter:card" content="summary_large_image" />
                        <meta name="twitter:title" content={`${product.name} | Diva Store`} />
                        <meta name="twitter:description" content={product.description} />
                        <meta name="twitter:image" content={encodeURI(`${baseUrl}/${product.mainImage.url.replace(/\\/g, '/')}`)} />
                    </Helmet>

                    <div className="flex flex-col md:flex-row items-start gap-8">
                        {/* Image Section */}
                        <div className="w-full md:w-3/5 lg:w-1/2 2xl:w-1/3">

                            <ImageGallery product={product} />

                        </div>

                        {/* Product Details */}
                        <div className="w-full md:w-2/5 lg:w-1/2 2xl:w-2/3 flex flex-col justify-center gap-6">
                            <h1 className="text-2xl font-semibold">{product.name}</h1>

                            <div className="flex items-center gap-4">
                                <p className="text-indigo-500 text-lg font-semibold">
                                    EGP {product.actualPrice}
                                </p>
                                {product.discount > 0 && (
                                    <p className="text-gray-500 line-through text-lg">EGP {product.price}</p>
                                )}
                            </div>

                            {/* Rating */}
                            <div className="flex items-center gap-2">
                                <span className="text-yellow-500 text-xl">
                                    {<FaStar className={`${product.reviews.length === 0 ? 'text-gray-300' : 'text-yellow-500'}`} />}
                                </span>
                                <span className="text-gray-400">({product.reviews.length} مراجعات)</span>
                            </div>

                            {/* Color Selection */}
                            {(availableSizes.length > 0 || availableColors.length > 0) && (
                                <div className="flex flex-col gap-4">
                                    {/* Size Dropdown */}
                                    {hasMultipleSizes && (
                                        <div className="flex items-center flex-wrap gap-4">
                                            <label>المقاسات:</label>
                                            {availableSizes.map((size, index) => (
                                                <button
                                                    key={index}
                                                    type='button'
                                                    name='product-size-btn'
                                                    className={`min-w-16 max-w-max flex items-center justify-center shadow-sm py-2 px-2 border-2 border-gray-100 rounded cursor-pointer duration-500 hover:border-indigo-300 ${(selectedSize === size) && filteredSizes.includes(size) ? 'border-indigo-300' : ''} ${!filteredSizes.includes(size) ? 'line-through' : ''}`}
                                                    onClick={() => {
                                                        handleSelectVariant('size', size, product.name);
                                                        setSelectedSize(selectedSize === size ? '' : size);
                                                    }}
                                                    disabled={!filteredSizes.includes(size)}
                                                >
                                                    {size}
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {/* Color Dropdown */}
                                    {hasMultipleColors && (
                                        <div className="flex items-center flex-wrap gap-4">
                                            <label>الألوان:</label>
                                            {availableColors.map((color, index) => (
                                                <button
                                                    key={index}
                                                    type='button'
                                                    name='product-color-btn'
                                                    className={`min-w-16 max-w-max flex items-center justify-center shadow-sm py-2 px-2 border-2 border-gray-100 rounded cursor-pointer duration-500 hover:border-indigo-300 ${(selectedColor === color) && filteredColors.includes(color) ? 'border-indigo-300' : ''} ${!filteredColors.includes(color) ? 'line-through' : ''}`}
                                                    onClick={() => {
                                                        handleSelectVariant('color', color, product.name);
                                                        setSelectedColor(selectedColor === color ? '' : color);
                                                    }}
                                                    disabled={!filteredColors.includes(color)}
                                                >
                                                    {color}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Quantity Selector */}
                            <div className="flex items-center gap-4">
                                <h3 className="text-lg font-semibold">الكمية:</h3>
                                <div className="flex items-center border border-gray-300 w-28 rounded-lg">
                                    <button
                                        type='button'
                                        name='pro-inc-quantity-btn'
                                        className="px-3 py-1 text-black rounded-r-md border-l border-gray-300"
                                        onClick={increaseQty}
                                    >
                                        +
                                    </button>
                                    <span className="px-4 py-1">{quantity}</span>
                                    <button
                                        type='button'
                                        name='pro-dec-quantity-btn'
                                        className="px-3 py-1 text-black rounded-l-md border-r border-gray-300"
                                        onClick={decreaseQty}
                                    >
                                        −
                                    </button>
                                </div>
                            </div>

                            {/* Shipping Info */}
                            <div className="flex items-center gap-1">
                                <MdLocalShipping className="w-5 h-5 text-indigo-500" />
                                <p className="text-gray-700">التوصيل خلال 2 إلى 5 أيام</p>
                            </div>

                            {/* Buttons */}
                            <div className="flex md:flex-col lg:flex-row gap-6">
                                <button
                                    type='button'
                                    name='pro-buynow-btn'
                                    className="w-full lg:min-w-40 lg:w-auto bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg shadow-sm" onClick={() => handleBuyNow(product, quantity)}>
                                    اشتري الان
                                </button>
                                <button
                                    type='button'
                                    name='pro-cartitem-btn'
                                    className="w-full lg:min-w-40 lg:w-auto bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-lg shadow-sm" onClick={() => addToCart(false, product, quantity, finalVariant)}>
                                    أضف إلى السلة
                                </button>
                            </div>


                            {/* Product Description */}
                            <div className="mt-12 hidden lg:block">
                                <h2 className="font-bold text-2xl mb-6">مواصفات المنتج</h2>
                                <div className="text-gray-500 mt-2" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product.description) }} ></div>
                            </div>
                        </div>
                    </div>

                    {/* Product Description */}
                    <div className="mt-12 lg:hidden">
                        <h2 className="font-bold text-2xl mb-6">مواصفات المنتج</h2>
                        <div className="text-gray-500 mt-2" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product.description) }} ></div>
                    </div>

                    {/* Product Reviews and Comments */}
                    <div className="flex flex-col md:flex-row gap-8 mt-12">
                        <div className="w-full md:w-3/5 custom-bg-white max-h-max">
                            <h2 className="text-xl font-bold text-center mb-4">آراء العملاء</h2>
                            {product.reviews.length > 0 ? (
                                <div className="text-center mb-4">
                                    <p className="text-lg flex flex-col items-center justify-center gap-2">
                                        <FaStar className="text-yellow-500" /> {(product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length).toFixed(0)} / 5
                                    </p>
                                    <p>{product.reviews.length} مراجعات</p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center gap-4">
                                    <div>
                                        <FaStar className="text-yellow-500" />
                                    </div>
                                    <p>كن أول من يقيم "{product.name}"</p>
                                </div>
                            )}

                            {/* Reviews List */}
                            <div className="mb-4">
                                {product.reviews.map((review, index) => (
                                    <div key={index} className="p-3 border-b">
                                        {/* <p className="font-semibold">{review.name}</p> */}
                                        <p>{new Date(review.createdAt).toISOString().split('T')[0]}</p>
                                        <p className="flex items-center gap-1">{
                                            [1, 2, 3, 4, 5].map(num => <FaStar key={num} className={`${num <= review.rating ? 'text-yellow-500' : 'text-gray-300'}`} />)}</p>
                                        <p className="text-gray-700">{review.comment}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Add Review Form */}
                        <div className="w-full md:w-2/5 custom-bg-white max-h-max">
                            <form onSubmit={(e) => submitReview(e, product._id)} className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <label className="block text-gray-700 font-medium">تقييمك</label>
                                    <div className="flex space-x-1" onMouseLeave={() => {
                                        !reviewDone && setNewReview({ ...newReview, rating: 0 })
                                    }}>
                                        {[1, 2, 3, 4, 5].map((num) => (
                                            <span
                                                key={num}
                                                className={`cursor-pointer w-6 h-6 flex items-center justify-center rounded-full ${newReview.rating >= num ? "text-yellow-500" : "text-gray-300"}`}
                                                onClick={() => {
                                                    handleRatingChange(num);
                                                    setReviewDone(true);
                                                }}
                                                onMouseOver={() => handleRatingChange(num)}
                                            ><FaStar /></span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="custom-label-field">اسمك</label>
                                    <input type="text" name="name" value={newReview.name} onChange={handleInputChange} className="custom-input-field" required />
                                </div>
                                <div>
                                    <label className="custom-label-field">مراجعتك</label>
                                    <textarea name="comment" value={newReview.comment} onChange={handleInputChange} className="custom-input-field resize-none" required></textarea>
                                </div>
                                <button type="submit" name="review-submit-btn" className="w-full bg-indigo-500 text-white py-2 px-4 rounded-lg duration-500 hover:bg-indigo-600">إرسال التقييم</button>
                            </form>
                        </div>
                    </div>
                </div>

            )}

            <Toaster toastOptions={{ duration: 3000 }} />
        </div>
    );
};

export default ProductDetails;
