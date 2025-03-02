import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCart } from "../../../context/CartContext";
import { useEffect } from "react";
import axios from "../../../api/axios";
import DOMPurify from 'dompurify';
import Loading from "../../../shared/components/Loading";
import toast, { Toaster } from "react-hot-toast";

const ProductDetails = ({ }) => {
    const { addToCart } = useCart();
    const [product, setProduct] = useState();
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [mainImgSrc, setMainImgSrc] = useState('');

    const [proVariants, setProVariants] = useState([]);

    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState("");

    const baseUrl = import.meta.env.VITE_SERVER_URL;

    const { id } = useParams();

    const navigate = useNavigate();

    // Get unique sizes and colors
    const availableSizes = [
        ...new Set(proVariants.filter((p) => p.stock > 0).map((p) => p.size)),
    ];
    const availableColors = [
        ...new Set(proVariants.filter((p) => p.stock > 0).map((p) => p.color)),
    ];

    // Filter colors based on selected size
    const filteredColors = selectedSize
        ? [
            ...new Set(
                proVariants
                    .filter((p) => p.size === selectedSize && p.stock > 0)
                    .map((p) => p.color)
            ),
        ]
        : availableColors;

    // Filter sizes based on selected color
    const filteredSizes = selectedColor
        ? [
            ...new Set(
                proVariants
                    .filter((p) => p.color === selectedColor && p.stock > 0)
                    .map((p) => p.size)
            ),
        ]
        : availableSizes;

    const increaseQty = () => setQuantity(quantity + 1);
    const decreaseQty = () => setQuantity(quantity > 1 ? quantity - 1 : 1);

    const handleBuyNow = (product, quantity) => {
        if(product.variants.length <= 1){
            addToCart(product, quantity);
            navigate('/checkout');
        } else if(selectedColor || selectedSize) {
            addToCart(product, quantity);
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

    if (loading) {
        return <Loading />
    }

    return (
        <div className="container">
            {product && (
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Image Section */}
                    <div className="w-3/5 flex justify-start items-center gap-2">
                        {/* Thumbnails */}
                        <div className="flex flex-row md:flex-col gap-4">
                            {product.images.map(image => {
                                const imgSrc = `${baseUrl}/${image.url.replace(/\\/g, '/')}`;
                                return (
                                    <img
                                        key={image._id}
                                        src={imgSrc}
                                        alt={image.alt}
                                        className={`w-20 cursor-pointer border border-gray-300 rounded-lg hover:border-gray-500 transition-all duration-300 ${mainImgSrc === imgSrc ? 'border-4 border-gray-500' : ''}`}
                                        onClick={() => setMainImgSrc(imgSrc)}
                                    />
                                )
                            })}
                        </div>
                        {/* Displayed Image */}
                        <div className="w-[85%] overflow-hidden rounded-xl border border-gray-300">
                            <img
                                src={mainImgSrc}
                                alt={product.mainImage.alt}
                                className="w-full transition-transform duration-300 ease-in-out transform hover:scale-120"
                            />
                        </div>
                    </div>

                    {/* Product Details */}
                    <div className="w-2/5">
                        <h1 className="text-3xl font-semibold mt-2">{product.name}</h1>
                        <div className="text-gray-500 mt-2" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product.description) }} ></div>

                        <div className="flex items-center gap-4 mt-3">
                            <p className="text-indigo-500 text-lg font-semibold">
                                {product.discount > 0 ? product.price - (product.price * (product.discount / 100)) : product.price}
                            </p>
                            {product.discount > 0 && (
                                <p className="text-gray-500 line-through text-lg">{product.price}</p>
                            )}
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-2 mt-2">
                            <span className="text-yellow-500 text-xl">★★★★★</span>
                            <span className="text-gray-400">({product.reviews.rating} مراجعات)</span>
                        </div>

                        {/* Color Selection */}
                        <div className="mt-4">
                            <div className="flex space-x-3 mt-2 flex-col gap-4">
                                {/* Size Dropdown */}
                                <div className="flex items-center gap-4">
                                    <label>المقاسات:</label>
                                    {availableSizes.map((size) => (
                                        <div
                                            key={size}
                                            className={`min-w-12 max-w-max flex items-center justify-center shadow py-1 border border-gray-200 rounded cursor-pointer ${(selectedSize === size) && filteredSizes.includes(size) ? 'bg-indigo-200' : ''} ${!filteredSizes.includes(size) ? 'line-through' : ''}`}
                                            onClick={() => setSelectedSize(size)}
                                            disabled={!filteredSizes.includes(size)}
                                        >
                                            {size}
                                        </div>
                                    ))}
                                </div>

                                {/* Color Dropdown */}
                                <div className="flex items-center gap-4">
                                    <label>الألوان:</label>
                                    {availableColors.map((color) => (
                                        <option
                                            key={color}
                                            className={`min-w-12 max-w-max flex items-center justify-center shadow py-1 border border-gray-200 rounded cursor-pointer ${(selectedColor === color) && filteredColors.includes(color) ? 'bg-indigo-200' : ''} ${!filteredColors.includes(color) ? 'line-through' : ''}`}
                                            onClick={() => setSelectedColor(color)}
                                            disabled={!filteredColors.includes(color)}
                                        >
                                            {color}
                                        </option>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Quantity Selector */}
                        <div className="mt-4">
                            <h3 className="text-lg font-semibold">الكمية:</h3>
                            <div className="flex items-center border border-gray-300 w-28 mt-2 rounded-lg">
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
                        <div className="flex gap-6 mt-6">
                            <button className="min-w-40 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg shadow-sm" onClick={() => handleBuyNow(product, quantity)}>
                                اشتري الان
                            </button>
                            <button className="min-w-40 bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-lg shadow-sm" onClick={() => addToCart(product, quantity)}>
                                أضف إلى السلة
                            </button>
                        </div>

                        {/* Shipping Info */}
                        {/* <p className="text-gray-500 mt-4">يتم التوصيل خلال 2 إلى 5 أيام عمل</p> */}
                    </div>
                </div>
            )}

            <Toaster />
        </div>
    );
};

export default ProductDetails;
