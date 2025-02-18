import { Link } from "react-router-dom";
import { useStore } from "../../../context/StoreContext";

const Categories = () => {
    const { modyStoreCategories } = useStore();

    return (
        <div className="bg-gray-100 mb-12">
            <h2 className="text-2xl font-semibold mb-6">الأقسام الأكثر شهرة</h2>
            <div className="flex items-center justify-center gap-6">
                {modyStoreCategories && modyStoreCategories.map((category, index) => (
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
