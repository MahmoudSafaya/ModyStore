import { Link } from "react-router-dom";

const allCategories = [
    { name: "ملابس رجالي", products: 8, image: "category-image.jpg" },
    { name: "ملابس نساء", products: 12, image: "category-image.jpg" },
    { name: "ملابس اطفال", products: 24, image: "category-image.jpg" },
    { name: "الكترونيات", products: 7, image: "category-image.jpg" },
    { name: "أحذية", products: 15, image: "category-image.jpg" },
    { name: "شنط", products: 5, image: "category-image.jpg" },
    { name: "لابتوبات", products: 2, image: "category-image.jpg" },
];

const Categories = () => {
    return (
        <div className="p-6 bg-gray-100">
            <h2 className="text-2xl font-semibold mb-6">الأقسام الأكثر شهرة</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-6">
                {allCategories.map((category, index) => (
                    <Link key={index} to='/' className="group bg-white p-4 rounded-xl shadow-md flex flex-col items-center">
                        <img src={category.image} alt={category.name} className="w-32 h-32 object-cover mb-4 transform transition-transform duration-500 group-hover:scale-110" />
                        <h3 className="text-lg font-medium">{category.name}</h3>
                        <p className="text-gray-500">{category.products} products</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default Categories
