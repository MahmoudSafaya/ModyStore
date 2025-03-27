import { useEffect } from "react";
import { useFavorites } from "../../../context/FavoritesContext";
import { Link } from "react-router-dom";
import { X, HeartOff } from 'lucide-react'
import ProductCard from "../components/ProductCard";
import { Toaster } from "react-hot-toast";

const Favorites = () => {
  const { favorites, setFavorites, saveFavoritesItems, getFavoritesItems, removeFromFavorites } = useFavorites();

  // Load cart from local storage on component mount
  useEffect(() => {
    const savedFavorites = getFavoritesItems();
    if (savedFavorites) {
      setFavorites(savedFavorites);
    }
  }, []);

  // Save cart to local storage whenever it changes
  useEffect(() => {
    if (favorites.length > 0) {
      saveFavoritesItems(favorites);
    }
  }, [favorites]);

  return (
    <div className="p-12">
      <h2 className="text-xl font-bold mb-6">منتجاتك المفضلة</h2>
      {favorites.length === 0 ? (
        <div className='flex flex-col items-center justify-center gap-6 mt-8'>
          <div>
            <HeartOff className='w-26 h-26 text-gray-200 drop-shadow-xs' />
          </div>
          <p>لا توجد منتجات في قائمتك المفضلة.</p>
          <Link to='/' className='max-w-max py-2 px-4 bg-indigo-500 text-white rounded-full duration-500 hover:be-indigo-600'>العودة الى التسوق</Link>
        </div>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {favorites.map((product) => {
            return (
              <div key={product._id}>
                <div className="mb-4">
                  <button
                    type='button'
                    name='favs-delete-btn'
                    onClick={() => removeFromFavorites(product._id)}
                    className="flex items-center gap-1 text-gray-500 duration-500 hover:text-gray-700 text-lg"
                  >
                    <X />
                    <span>حذف من القائمة</span>
                  </button>
                </div>

                <ProductCard product={product} />
              </div>
            )
          })}
        </section>
      )
      }

      <Toaster />
    </div >
  );
};

export default Favorites;
