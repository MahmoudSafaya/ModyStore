import { useNavigate } from "react-router-dom";
import { useApp } from "../../../context/AppContext";

const Categories = () => {
    const { mainCategories } = useApp();
    const baseUrl = import.meta.env.VITE_SERVER_URL;

    const navigate = useNavigate();

    const handleCategoryClick = (categoryId) => {
        navigate(`/products/category/${categoryId}`);
    };

    return (
        <div className="bg-gray-100 mt-12 px-4 md:px-12">
            <h2 className="text-2xl font-semibold mb-6">الأقسام الأكثر شهرة</h2>
            <div className="flex items-center justify-center flex-wrap gap-6">
                {mainCategories && mainCategories.map(item => {
                    const correctedPath = item.image.url.replace(/\\/g, '/');
                    const fullImageUrl = encodeURI(`${baseUrl}/${correctedPath}`);
                    return (
                        <div key={item._id} onClick={() => handleCategoryClick(item._id)} className="group bg-white p-4 rounded-xl shadow-md flex flex-col items-center cursor-pointer">
                            <img src={fullImageUrl} alt={item.image.alt} loading="lazy" className="w-32 h-32 object-cover mb-4 duration-500 rounded-lg group-hover:scale-110" />
                            <h3 className="text-lg font-medium">{item.name}</h3>
                            {/* <p className="text-gray-500">{item.products} products</p> */}
                        </div>
                    )
                })}
            </div>
        </div>
    );
}

export default Categories
