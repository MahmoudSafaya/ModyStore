import { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Trash, Search, X, ChevronRight, ChevronLeft, ChevronDown } from "lucide-react";
import { FaCheck, FaRegEdit, FaStar } from "react-icons/fa";
import { axiosAuth } from '../../../api/axios';
import Loading from '../../../shared/components/Loading';
import { Toaster } from 'react-hot-toast';
import { useAuth } from '../../../context/AuthContext';
import { useApp } from '../../../context/AppContext';
import { A_BillOfLading, A_DeleteConfirmModal } from '../components';
import { IoStorefrontOutline } from "react-icons/io5";

const Products = () => {
  const { loading, setLoading } = useAuth();
  const { categories, isDelete, setIsDelete, deleteNotify } = useApp();
  const [products, setProducts] = useState([]);
  const [checkedAll, setCheckedAll] = useState(false);
  const [checkedOrders, setCheckedOrders] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [selectedProduct, setSelectedProduct] = useState();
  const [popupPurpose, setPopupPurpose] = useState('');
  const [barcodeNums, setBarcodeNums] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const baseUrl = import.meta.env.VITE_SERVER_URL;
  const navigate = useNavigate();

  const handleCheckOrder = (proId) => {
    if (checkedOrders.some(item => item._id === proId)) {
      const newOrders = checkedOrders.filter(item => item._id !== proId);
      setCheckedOrders([...newOrders]);
    } else {
      const newOrders = products.filter(item => item._id === proId);
      setCheckedOrders([...checkedOrders, ...newOrders]);
    }
  }
  const handleSelectAll = () => {
    setCheckedAll(!checkedAll);
    if (!checkedAll) {
      setCheckedOrders(products);
    } else {
      setCheckedOrders([]);
    }
  }

  useEffect(() => {
    if (checkedOrders.length > 0 && checkedOrders.length === products.length) {
      setCheckedAll(true);
    } else {
      setCheckedAll(false);
    }
  }, [checkedOrders]);

  const getAllProducts = async (page) => {
    setLoading(true);
    try {
      const res = await axiosAuth.get(`/products?page=${page}`);
      const data = res.data;
      setProducts(data.Products);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const calculateTotalStock = (variants) => {
    return variants.reduce((total, item) => total + (item.stock), 0);
  };

  const getCategory = (cateID) => {
    return categories.map(item => item._id === cateID ? item.name : '');
  }

  const handleDeleteProduct = async (itemID) => {
    try {
      await axiosAuth.delete(`/products/${itemID}`);
      deleteNotify('تم حذف المنتج بنجاح.');
      setTimeout(() => {
        getAllProducts();
      }, 500);
    } catch (error) {
      console.error(error);
    }
  }

  const deleteAllSelected = async () => {
    try {
      // Iterate over each product in the array
      for (const product of checkedOrders) {
        // Send a DELETE request for each product using its _id
        await axiosAuth.delete(`/products/${product._id}`);
        deleteNotify("تم حذف المنتجات المحددة بنجاح.");
        setTimeout(() => {
          getAllProducts();
        }, 500);
      }
    } catch (error) {
      console.error('Error deleting products:', error);
    }
  };

  const handleEditClick = (productID) => {
    navigate(`/admin/add-product?product=${productID}`);
  };

  useEffect(() => {
    getAllProducts(currentPage);
    setLoading(false);
  }, [currentPage]);

  const deleteProductReview = async (productId, reviewId) => {
    try {
      await axiosAuth.delete(`/products/${productId}/reviews/${reviewId}`);
      deleteNotify('تم حذف المراجعة بنجاح.');
      setPopupPurpose('reviews');
      setTimeout(() => {
        getAllProducts();
      }, 500);
    } catch (error) {
      console.error(error);
    }
  }

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
    setCheckedAll(false);
  };

  const handleBarcodeChange = useCallback((e, barCode) => {
    setBarcodeNums(prev => ({
      ...prev,
      [barCode]: Number(e.target.value)
    }));
  }, []);

  if (loading) return <Loading loading={loading} />;


  return (
    <div>
      {/* Search Feature */}
      <div className="custom-bg-white flex flex-col md:flex-row items-center gap-4">
        <div className='w-full md:w-auto flex-grow'>
          <div className="relative w-full">
            <input type="text" name="product-search" id="product-search" className="custom-input-field w-full" placeholder="بحث عن منتج..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
            <Search className="w-20 h-[calc(100%-2px)] my-[1px] ml-[1px] text-2xl p-2 rounded-l-lg bg-gray-100 text-gray-400 absolute top-0 left-0 border border-gray-200" />
          </div>
        </div>
        <button type='button' name='products-all-delete-btn' className={`min-w-30 w-full md:w-auto lg:whitespace-nowrap py-3 px-2 text-center rounded-lg shadow-md bg-red-100 text-red-500 hover:bg-red-200 duration-500 ${!checkedOrders.length > 0 ? 'opacity-25' : ''}`} onClick={() => setIsDelete({ purpose: 'delete-selected', itemName: 'جميع الاختيارات' })} disabled={!checkedOrders.length > 0}>
          حذف الاختيارات
        </button>
      </div>

      {/* Table */}
      <div className="custom-bg-white mt-8 overflow-x-auto scrollbar">
        {products && products.length > 0 ? (
          <table className="w-full bg-white text-gray-800">
            <thead className="border-b border-gray-300 font-bold text-center whitespace-nowrap">
              <tr>
                <th>
                  <label className="flex items-center justify-center h-5">
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={checkedAll}
                      onChange={handleSelectAll}
                    />
                    <div
                      className={`w-5 h-5 p-1 flex items-center justify-center rounded-sm border duration-500 cursor-pointer ${checkedAll ? "bg-indigo-500 border-indigo-500" : "border-gray-300"
                        }`}
                    >
                      {checkedAll && (
                        <FaCheck className='text-white' />
                      )}
                    </div>
                  </label>
                </th>
                <th className='p-3'>المنتج</th>
                <th className="p-3">الاسم</th>
                <th className="p-3">القسم</th>
                <th className="p-3">الحاله</th>
                <th className="p-3">المخزون</th>
                <th className="p-3">سعر البيع</th>
                <th className="p-3">الخصم</th>
                <th className="p-3">المراجعات</th>
                <th className="p-3">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {products && products.filter(item => item.name.toLowerCase().includes(searchInput.toLowerCase()) ? item : '').map((product) => (
                <tr key={product._id} className="border-b border-gray-200 hover:bg-gray-50 text-center  whitespace-nowrap">
                  <td className='p-3'>
                    <label className="flex items-center justify-center h-5">
                      <input
                        type="checkbox"
                        name={product.name}
                        className="hidden"
                        checked={checkedOrders.some(item => item._id === product._id)}
                        onChange={() => handleCheckOrder(product._id)}
                      />
                      <div
                        className={`w-5 h-5 p-1 flex items-center justify-center rounded-sm border duration-500 cursor-pointer ${checkedOrders.some(item => item._id === product._id) ? "bg-indigo-500 border-indigo-500" : "border-gray-300"
                          }`}
                      >
                        {checkedOrders.some(item => item._id === product._id) && (
                          <FaCheck className='text-white' />
                        )}
                      </div>
                    </label>
                  </td>
                  <td className='p-3'>
                    <div className="w-15 h-15 p-2 mx-auto">
                      <img src={encodeURI(`${baseUrl}/${product.mainImage.url.replace(/\\/g, '/')}`)} alt={product.mainImage.alt} loading="lazy" className='w-full h-full object-cover rounded-lg' />
                    </div>
                  </td>
                  <td className="p-3 space-x-3">
                    {product.name.length > 20 ? product.name.slice(0, 20) + '...' : product.name}
                  </td>
                  <td className="p-3 text-gray-500">
                    {getCategory(product.category)}
                  </td>
                  <td className="p-3">
                    <span
                      className={`inline-flex items-center justify-center p-2 rounded-lg text-sm ${product.isActive
                        ? "bg-green-100 text-green-500"
                        : "bg-red-100 text-red-500"
                        }`}
                    >
                      {product.isActive ? 'نشط' : 'غير نشط'}
                      <span
                        className={`w-2 h-2 mr-2 rounded-full ${product.isActive ? "bg-green-500" : "bg-red-500"
                          }`}
                      ></span>
                    </span>
                  </td>
                  {/* <td className="p-3 text-gray-500">{item.inStock}</td> */}
                  <td className="p-3 text-gray-500 group cursor-pointer" onClick={() => {
                    setSelectedProduct(product);
                    setPopupPurpose('variants');
                  }}>
                    <p className={`inline-block ml-2 ${calculateTotalStock(product.variants) > 0 ? '' : 'text-red-400'}`}>
                      {calculateTotalStock(product.variants) > 0 ? calculateTotalStock(product.variants) : 'تم النفاذ'}
                    </p>
                    <ChevronDown className='mx-auto duration-500 inline-block group-hover:rotate-45 group-hover:text-indigo-500' />
                  </td>
                  <td className="p-3 font-semibold">{product.actualPrice}</td>
                  <td className="p-3">%{product.discount.toFixed(0)}</td>
                  {product.reviews.length > 0 ? (
                    <td className='p-3 text-gray-500 group cursor-pointer' onClick={() => {
                      setSelectedProduct(product);
                      setPopupPurpose('reviews');
                    }}>
                      <p className='inline-block ml-2'>{product.reviews.length}</p>
                      <ChevronDown className='inline-block duration-500 group-hover:rotate-45 group-hover:text-indigo-500' />
                    </td>
                  ) : (
                    <td className='p-3 text-gray-500'>
                      -
                    </td>
                  )}
                  <td className="p-3">
                    <div className='inline-block px-4 cursor-pointer duration-500 hover:text-indigo-500 hover:rotate-45' onClick={() => handleEditClick(product._id)}>
                      <FaRegEdit className="w-5 h-5" />
                    </div>
                    <div className='inline-block px-4 cursor-pointer duration-500 hover:text-red-500 hover:rotate-45' onClick={() => setIsDelete({ purpose: 'one-product', itemId: product._id, itemName: product.name })}>
                      <Trash className="w-5 h-5" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col items-center gap-6">
            <div>
              <IoStorefrontOutline className="w-20 h-20 opacity-25" />
            </div>
            <p className="text-2xl font-medium">لا يوجد منتجات في الوقت الحالي</p>

            <Link to='/admin/add-product' className="max-w-max bg-indigo-500 text-white py-2 px-6 rounded-lg shadow-sm duration-500 hover:bg-indigo-600" aria-label="Add a new product">إضافة منتج جديد</Link>

          </div>
        )}
      </div>


      {/* Pagination Controls */}
      {products.length > 0 && (
        <div className="flex justify-center mt-4">
          <button
            type='button'
            name='products-nxt-btn'
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 mx-1 bg-gray-200 rounded disabled:opacity-25"
          >
            <ChevronRight />
          </button>

          {/* Page Numbers */}
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              type='button'
              name='products-page-btn'
              onClick={() => handlePageChange(index + 1)}
              className={`px-4 py-2 mx-1 rounded ${currentPage === index + 1 ? "bg-indigo-500 text-white" : "bg-gray-200"
                }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            type='button'
            name='products-prev-btn'
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 mx-1 bg-gray-200 rounded disabled:opacity-25"
          >
            <ChevronLeft />
          </button>
        </div>
      )}

      <Toaster toastOptions={{ duration: 3000 }} />

      {/* Product Info Popup */}
      {selectedProduct && (
        <div className='fixed inset-0 flex items-center justify-center z-100 bg-[#00000035] overflow-y-auto'>
          <div className='w-5/6 lg:w-3/5 xl:w-1/2 custom-bg-white my-12'>
            <div className="relative flex items-center justify-between mb-8">
              <p className='flex-grow text-center font-semibold'>{selectedProduct.name}</p>
              <div className='w-7 h-7 p-1 absolute top-0 left-0 bg-gray-100 rounded-full flex items-center justify-center'>
                <X className='w-full cursor-pointer duration-500 hover:rotate-90' onClick={() => {
                  setSelectedProduct('');
                  setPopupPurpose('');
                }} />
              </div>
            </div>
            {popupPurpose === 'variants' && (
              <div className='mb-8 flex flex-col gap-4'>
                {selectedProduct.variants.map(variant => (
                  <div key={variant._id} className='flex items-center justify-between flex-col md:flex-row gap-4'>
                    <div className='w-full md:w-auto flex items-center justify-center md:justify-between gap-4'>
                      {variant.size && (<p>المقاس: {variant.size}</p>)}
                      {variant.color && (<p>اللون: {variant.color}</p>)}
                      {variant.stock && (<p>الكمية: {variant.stock}</p>)}
                    </div>
                    <div className='w-full md:w-auto flex items-center gap-4'>
                      <label htmlFor={`${variant.size}-${variant.color}`}>
                        <input type="text" name={`${variant.size}-${variant.color}`} id={`${variant.size}-${variant.color}`} className='w-full custom-input-field md:max-w-20 text-center' placeholder='0' value={barcodeNums[variant.barCode] || variant.stock} onChange={(e) => handleBarcodeChange(e, variant.barCode)} />
                      </label>
                      <A_BillOfLading
                        variant={variant.barCode}
                        stock={barcodeNums ? barcodeNums[variant.barCode] : Number(variant.stock)}
                        billName={`${selectedProduct.name.slice(0, 20)} ${variant.size} (${variant.color})`}
                      />
                    </div>
                  </div>
                )
                )}
              </div>
            )}
            {popupPurpose === 'reviews' && (
              <div>
                <h2 className='text-center text-gray-800 font-semibold'>اراء العملاء لهذا المنتج</h2>
                {selectedProduct.reviews.map((review, index) => (
                  <div key={index} className="py-4 border-b border-gray-300 flex justify-between items-center">
                    <div>
                      {/* <p className="font-semibold">{review.name}</p> */}
                      <p>{new Date(review.createdAt).toISOString().split('T')[0]}</p>
                      <p className="flex items-center gap-1">{
                        [1, 2, 3, 4, 5].map(num => <FaStar key={num} className={`${num <= review.rating ? 'text-yellow-500' : 'text-gray-300'}`} />)}
                      </p>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                    {/* <div className='w-7 h-7 p-1 bg-gray-100 rounded-full flex items-center justify-center'>
                      <Trash className='w-full cursor-pointer duration-500 hover:rotate-45' onClick={() => deleteProductReview(selectedProduct._id, review._id)} />
                    </div> */}
                    <div className='w-7 h-7 p-1 bg-gray-100 rounded-full flex items-center justify-center'>
                      <Trash className='w-full cursor-pointer duration-500 hover:rotate-45' onClick={() => setIsDelete({ purpose: 'one-review', itemName: 'هذه المراجعة', itemId: review._id })} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {isDelete.purpose === 'delete-selected' && (
        <A_DeleteConfirmModal itemName={isDelete.itemName} deleteFun={deleteAllSelected} setIsDelete={setIsDelete} />
      )}
      {isDelete.purpose === 'one-product' && (
        <A_DeleteConfirmModal itemName={isDelete.itemName} deleteFun={() => handleDeleteProduct(isDelete.itemId)} setIsDelete={setIsDelete} />
      )}
      {isDelete.purpose === 'one-review' && (
        <A_DeleteConfirmModal itemName={isDelete.itemName} deleteFun={() => deleteProductReview(selectedProduct._id, isDelete.itemId)} setIsDelete={setIsDelete} />
      )}

    </div>
  )
}

export default Products