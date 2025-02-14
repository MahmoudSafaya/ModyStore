import { useState } from "react";
import ProductTest from "./ProductTest";
const product = {

    id: 1,
    name: "فستان حريمي صوف قصير",
    category: "ملابس نساء",
    amount: 20,
    rating: 5,
    image: "category-image.jpg",
    discount: "خصم 14%",
    price: 458.00,
    oldPrice: 350,
    inStock: true,
    reviews: 236,
    description:
        "خامته صوف عجينة تقيل وناعم، هتحسّي بالراحة والدفا طول اليوم ",
    colors: ["ازرق", "احمر"],
};

const ProductDetails = () => {
    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState("احمر");

    const [mainImage, setMainImage] = useState(product.image);
    console.log(mainImage)

    const thumbnails = [
        "https://images.pexels.com/assets/static/images/canva/photo-background-remover.png?w=600",
        "https://images.pexels.com/photos/1906658/pexels-photo-1906658.jpeg?auto=compress&cs=tinysrgb&w=600",
        "https://images.pexels.com/photos/2088210/pexels-photo-2088210.jpeg?auto=compress&cs=tinysrgb&w=600",
        "https://images.pexels.com/photos/848573/pexels-photo-848573.jpeg?auto=compress&cs=tinysrgb&w=600",
    ];

    const handleThumbnailHover = (image) => {
        setMainImage(image);
    };

    const increaseQty = () => setQuantity(quantity + 1);
    const decreaseQty = () => setQuantity(quantity > 1 ? quantity - 1 : 1);

    return (
        <div className="container mx-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Image Section */}
                <div className="relative">
                    <div className="h-full overflow-hidden rounded-lg border">
                        <img
                            src={mainImage}
                            alt={product.name}
                            className="w-full h-auto transition-transform duration-300 ease-in-out transform hover:scale-110"
                        />
                    </div>
                    {/* Thumbnails */}
                    <div className="flex gap-4 mt-4">
                        {thumbnails.map((thumbnail, index) => (
                            <img
                                key={index}
                                src={thumbnail}
                                alt={`Thumbnail ${index + 1}`}
                                className="w-20 h-20 cursor-pointer border-2 border-transparent hover:border-gray-400 transition-all duration-200"
                                onMouseEnter={() => handleThumbnailHover(thumbnail)}
                            />
                        ))}
                    </div>
                </div>

                {/* Product Details */}
                <div>
                    {product.inStock ? (
                        <span className="px-3 py-1 bg-green-200 text-green-800 text-sm font-semibold rounded-md">
                            In Stock
                        </span>
                    ) : (
                        <span className="px-3 py-1 bg-red-200 text-red-800 text-sm font-semibold rounded-md">
                            Out of Stock
                        </span>
                    )}

                    <h1 className="text-3xl font-semibold mt-2">{product.name}</h1>
                    <p className="text-gray-500 mt-2">{product.description}</p>

                    <div className="flex items-center gap-4 mt-3">
                        <span className="text-indigo-500 font-bold text-2xl">EGP {product.price}</span>
                        <span className="text-gray-400 line-through text-lg">EGP {product.oldPrice}</span>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mt-2">
                        <span className="text-yellow-500 text-xl">★★★★★</span>
                        <span className="text-gray-400">({product.reviews} مراجعات)</span>
                    </div>

                    {/* Color Selection */}
                    <div className="mt-4">
                        <h3 className="text-lg font-medium">الألوان:</h3>
                        <div className="flex space-x-3 mt-2">
                            {product.colors.map((color) => (
                                <button
                                    key={color}
                                    className={`py-2 px-6 rounded-lg border border-gray-300 text-gray-700 ${selectedColor === color ? "border-indigo-500" : "border-gray-300"
                                        }`}
                                    onClick={() => setSelectedColor(color)}
                                >{color}</button>
                            ))}
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
                        <button className="min-w-60 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg shadow-sm">
                            اشتري الان
                        </button>
                        <button className="min-w-60 bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-lg shadow-sm">
                            أضف إلى السلة
                        </button>
                    </div>

                    {/* Shipping Info */}
                    {/* <p className="text-gray-500 mt-4">Dispatched in 2-3 weeks</p>
                    <a href="#" className="text-blue-500 underline">
                        Why the longer time for delivery?
                    </a> */}
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
