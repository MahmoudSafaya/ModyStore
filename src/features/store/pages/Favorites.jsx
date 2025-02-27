import { useEffect } from "react";
import { useFavorites } from "../../../context/FavoritesContext";
import { Link } from "react-router-dom";
import { X, HeartOff } from 'lucide-react'
import { useCart } from "../../../context/CartContext";

const Favorites = () => {
  const { favorites, setFavorites, saveFavoritesItems, getFavoritesItems, removeFromFavorites } = useFavorites();
  const { addToCart } = useCart();

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
    <div className="">
      <h2 className="text-xl font-bold mb-6">منتجاتك المفضلة</h2>
      {favorites.length === 0 ? (
        <div className='flex flex-col items-center justify-center gap-6 mt-8'>
          <div>
            <HeartOff className='w-26 h-26 text-gray-200 drop-shadow-xs' />
          </div>
          <p>لا توجد منتجات في قائمتك المفضلة.</p>
          <Link to='/products' className='max-w-max py-2 px-4 bg-indigo-500 text-white rounded-full duration-500 hover:be-indigo-600'>العودة الى التسوق</Link>
        </div>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {favorites.map((item) => {
            const { id, name, category, price, oldPrice, image, discount, rating, storageAmount } = item;

            return (
              <div key={id}>
                <div className="mb-4">
                  <button
                    onClick={() => removeFromFavorites(id)}
                    className="flex items-center gap-1 text-gray-500 duration-500 hover:text-gray-700 text-lg"
                  >
                    <X />
                    <span>حذف من القائمة</span>
                  </button>
                </div>
                <div className="group bg-white p-6 rounded-xl shadow-md relative overflow-hidden">
                  {discount && (
                    <span className="absolute top-2 left-2 z-40 bg-red-500 text-white text-xs px-3 py-1 rounded-full">
                      {discount}
                    </span>
                  )}
                  <div className="relative w-full h-60 overflow-hidden rounded-lg">
                    <Link to={`/products/${id}`}>
                      <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 hover:scale-110"
                        style={{ backgroundImage: `url(${image})` }}></div>
                    </Link>
                  </div>
                  <h3 className="text-lg font-medium my-2">
                    <Link to={`/products/${id}`} className="duration-500 hover:text-indigo-500">
                      {name}
                    </Link>
                  </h3>
                  <p className="text-gray-500 text-sm">{category}</p>
                  <div className="flex items-center mb-2">
                    {Array(rating)
                      .fill()
                      .map((_, i) => (
                        <span key={i} className="text-yellow-500">★</span>
                      ))}
                  </div>
                  <p className={`mb-2 ${storageAmount > 0 ? 'text-gray-400' : 'text-red-500'}`}>
                    {storageAmount > 0 ? `متوفر: ${storageAmount} قطعة` : 'تم نفاذ المنتج'}
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-indigo-500 text-lg font-semibold">{price}</p>
                    {oldPrice && (
                      <p className="text-gray-500 line-through text-sm">{oldPrice}</p>
                    )}
                  </div>
                  <button className="mt-4 bg-indigo-500 text-white px-4 py-2 rounded w-full duration-500 hover:bg-indigo-600" onClick={() => addToCart(item)}>
                    أضف إلى السلة
                  </button>
                </div>
              </div>
            )
          })}
        </section>
      )}
    </div>
  );
};

export default Favorites;
