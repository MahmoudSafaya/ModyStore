import { useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCart } from "../../../context/CartContext";
import { useEffect } from "react";
import axios from "../../../api/axios";
import DOMPurify from 'dompurify';
import Loading from "../../../shared/components/Loading";
import toast, { Toaster } from "react-hot-toast";
import { FaStar } from "react-icons/fa";

const ProductDetails = ({ }) => {
    const { addToCart } = useCart();
    const [product, setProduct] = useState();
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [mainImgSrc, setMainImgSrc] = useState('');
    const scrollContainerRef = useRef(null);

    const [proVariants, setProVariants] = useState([]);
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [selectedVariant, setSelectedVariant] = useState();

    const [newReview, setNewReview] = useState({ name: "", rating: 0, comment: "" });
    const [reviewDone, setReviewDone] = useState(false);

    const baseUrl = import.meta.env.VITE_SERVER_URL;

    const { id } = useParams();

    const navigate = useNavigate();

    const handleSelectSize = (size) => {
        if (selectedSize === size) {
            setSelectedSize('');
            setSelectedVariant({ ...selectedVariant, size: '' });
        } else {
            setSelectedSize(size);
            setSelectedVariant({ ...selectedVariant, size: size });
        }
    }
    const handleSelectColor = (color) => {
        if (selectedColor === color) {
            setSelectedColor('');
            setSelectedVariant({ ...selectedVariant, color: '' });
        } else {
            setSelectedColor(color);
            setSelectedVariant({ ...selectedVariant, color: color });
        }
    }

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
        const totalStock = proVariants.reduce((total, item) => total + item.stock, 0);
        console.log(totalStock)
        if (quantity < totalStock) {
            setQuantity(quantity + 1)
        } else {
            toast('عفوا, الكمية المطلوبة لست متوفرة في الوقت الحالي.', {
                style: {
                    textAlign: 'center'
                }
            })
        }
    };
    const decreaseQty = () => setQuantity(quantity > 1 ? quantity - 1 : 1);

    const handleBuyNow = (product, quantity) => {
        if (product.variants.length <= 1) {
            addToCart(product, quantity);
            navigate('/checkout');
        } else if (selectedColor || selectedSize) {
            addToCart(product, quantity, selectedVariant);
            navigate('/checkout');
        } else {
            toast(
                "من فضلك, اختر مقاس أو لون مناسب لك أولاً.",
                {
                    duration: 7000,
                    style: {
                        textAlign: 'center',
                    },
                }
            );
            return false;
        }
    }

    useEffect(() => {
        const getProductById = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`/products/${id}`);
                setProduct(res.data)
                setProVariants(res.data.variants);
                console.log(res)
                setLoading(false)
            } catch (error) {
                console.log(error);
            }
        }

        getProductById();
    }, [id]);

    useEffect(() => {
        if (product?.mainImage) {
            setMainImgSrc(`${baseUrl}/${product.mainImage.url.replace(/\\/g, '/')}`);
        }
    }, [product])


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
            const res = await axios.post(`/products/${productId}/reviews`, newReview);
            console.log(res);
            setNewReview({ name: "", rating: 0, comment: "" });
        }
    };

    if (loading) {
        return <Loading loading={loading} />
    }

    return (
        <div className="py-12 px-6 md:px-12 text-gray-800">
            {product && (
                <div>
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Image Section */}
                        <div className="w-full md:w-3/5 flex flex-col-reverse justify-start items-center gap-2">

                            <div className="flex flex-col-reverse md:flex-row w-full gap-4">
                                {/* Thumbnail Container */}
                                <div
                                    ref={scrollContainerRef}
                                    className="relative w-full md:w-20 h-20 md:h-[350px] my-auto overflow-x-auto md:overflow-y-auto flex md:flex-col gap-2 scrollbar-hide"
                                >
                                    {product.images.map((image, index) => {
                                        const imgSrc = `${baseUrl}/${image.url.replace(/\\/g, '/')}`;
                                        return (
                                            <img
                                                key={image._id}
                                                src={imgSrc}
                                                alt={image.alt}
                                                className={`w-full h-20 object-cover cursor-pointer rounded-md border-3 ${mainImgSrc === imgSrc ? "border-indigo-400" : "border-gray-100"
                                                    }`}
                                                onClick={() => setMainImgSrc(imgSrc)}
                                            />
                                        )
                                    })}
                                </div>

                                {/* Main Image Display */}
                                <div className="flex-1 rounded-xl overflow-hidden">
                                    <img
                                        src={mainImgSrc}
                                        alt={product.mainImage.alt}
                                        className="w-full object-cover rounded-xl duration-500 hover:scale-130"
                                    />
                                </div>
                            </div>

                        </div>

                        {/* Product Details */}
                        <div className="w-2/5 flex flex-col justify-center gap-6">
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
                            {(availableSizes.length > 0 || availableColors.lenght > 0) && (
                                <div className="flex flex-col gap-4">
                                    {/* Size Dropdown */}
                                    {hasMultipleSizes && (
                                        <div className="flex items-center gap-4">
                                            <label>المقاسات:</label>
                                            {availableSizes.map((size) => (
                                                <div
                                                    key={size}
                                                    className={`min-w-16 max-w-max flex items-center justify-center shadow-sm py-2 px-2 border-2 border-gray-100 rounded cursor-pointer duration-500 hover:border-indigo-300 ${(selectedSize === size) && filteredSizes.includes(size) ? 'border-indigo-300' : ''} ${!filteredSizes.includes(size) ? 'line-through' : ''}`}
                                                    onClick={() => handleSelectSize(size)}
                                                    disabled={!filteredSizes.includes(size)}
                                                >
                                                    {size}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Color Dropdown */}
                                    {hasMultipleColors && (
                                        <div className="flex items-center gap-4">
                                            <label>الألوان:</label>
                                            {availableColors.map((color) => (
                                                <option
                                                    key={color}
                                                    className={`min-w-16 max-w-max flex items-center justify-center shadow-sm py-2 px-2 border-2 border-gray-100 rounded cursor-pointer duration-500 hover:border-indigo-300 ${(selectedColor === color) && filteredColors.includes(color) ? 'border-indigo-300' : ''} ${!filteredColors.includes(color) ? 'line-through' : ''}`}
                                                    onClick={() => handleSelectColor(color)}
                                                    disabled={!filteredColors.includes(color)}
                                                >
                                                    {color}
                                                </option>
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
                                        className="px-3 py-1 text-black rounded-r-md border-l border-gray-300"
                                        onClick={increaseQty}
                                    >
                                        +
                                    </button>
                                    <span className="px-4 py-1">{quantity}</span>
                                    <button
                                        className="px-3 py-1 text-black rounded-l-md border-r border-gray-300"
                                        onClick={decreaseQty}
                                    >
                                        −
                                    </button>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-6">
                                <button className="min-w-40 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg shadow-sm" onClick={() => handleBuyNow(product, quantity)}>
                                    اشتري الان
                                </button>
                                <button className="min-w-40 bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-lg shadow-sm" onClick={() => addToCart(product, quantity, selectedVariant)}>
                                    أضف إلى السلة
                                </button>
                            </div>

                            {/* Shipping Info */}
                            {/* <p className="text-gray-500 mt-4">يتم التوصيل خلال 2 إلى 5 أيام عمل</p> */}
                        </div>
                    </div>

                    {/* Product Description */}
                    <div className="mt-12">
                        <h2 className="font-bold text-2xl mb-6">مواصفات المنتج</h2>
                        <div className="text-gray-500 mt-2" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product.description) }} ></div>
                    </div>

                    {/* Product Reviews and Comments */}
                    <div className="flex flex-col lg:flex-row gap-8 mt-12">
                        <div className="w-3/5 custom-bg-white max-h-max">
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
                                            [1, 2, 3, 4, 5].map(num => <FaStar className={`${num <= review.rating ? 'text-yellow-500' : 'text-gray-300'}`} />)}</p>
                                        <p className="text-gray-700">{review.comment}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Add Review Form */}
                        <div className="w-2/5 custom-bg-white max-h-max">
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
                                <button type="submit" className="w-full bg-indigo-500 text-white py-2 px-4 rounded-lg duration-500 hover:bg-indigo-600">إرسال التقييم</button>
                            </form>
                        </div>
                    </div>
                </div>

            )}

            <Toaster />
        </div>
    );
};

export default ProductDetails;
