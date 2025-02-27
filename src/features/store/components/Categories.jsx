import { Link } from "react-router-dom";
import { useStore } from "../../../context/StoreContext";

const Categories = () => {
    const { categories } = useStore();
    const baseUrl = import.meta.env.VITE_SERVER_URL;

    return (
        <div className="bg-gray-100 mb-12 mt-12">
            <h2 className="text-2xl font-semibold mb-6">الأقسام الأكثر شهرة</h2>
            <div className="flex flex-row flex-wrap items-center justify-center gap-6">
                {categories && categories.map(item => {
                    const correctedPath = item.image.url.replace(/\\/g, '/');
                    const fullImageUrl = `${baseUrl}/${correctedPath}`;
                    return (
                        <Link key={item._id} to={`/products/?category=${item._id}`} className="group bg-white p-4 rounded-xl shadow-md flex flex-col items-center">
                            <img src={fullImageUrl} alt={item.image.alt} className="w-32 h-32 object-cover mb-4 transform transition-transform duration-500 group-hover:scale-110" />
                            <h3 className="text-lg font-medium">{item.name}</h3>
                            {/* <p className="text-gray-500">{item.products} products</p> */}
                        </Link>
                    )
                })}
            </div>
        </div>
    );
}

export default Categories
