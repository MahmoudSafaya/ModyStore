import React, { useState } from 'react';
import BeatLoader from "react-spinners/BeatLoader";

const DeleteConfirmModal = ({ itemName, deleteFun, setIsDelete }) => {
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        setLoading(true);
        try {
            await deleteFun();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setIsDelete({});
        }
    }

    return (
        <div className='fixed top-0 right-0 z-100 w-screen h-screen bg-[#00000035] flex justify-center items-start overflow-y-auto'>
            <div className='w-5/6 md:w-1/2 lg:w-1/3 custom-bg-white fixed top-1/2 left-1/2 -translate-1/2 z-80 flex flex-col gap-8 shadow-md'>
                <p className='text-center w-full text-gray-900'>هل انت متأكد من حذف: <span className='font-semibold'>
                    {itemName}</span> ؟</p>
                <div className='flex justify-center gap-4'>
                    <button type='button' name='popup-yes-btn' className='w-20 bg-red-500 text-white rounded-lg py-2 px-4 duration-500 hover:bg-red-600'
                        onClick={handleClick}>نعم</button>

                    <button
                        type='button'
                        name='popup-no-btn'
                        className='w-20 bg-gray-200 text-gray-900 rounded-lg py-2 px-4 duration-500 hover:bg-gray-300' onClick={() => setIsDelete({})}>لا</button>
                </div>
            </div>

            {loading && (
                <div className="w-full h-full fixed top-0 left-0 z-120 bg-[#FFFFFF70] flex justify-center items-center">
                    <BeatLoader
                        color={'oklch(0.585 0.233 277.117)'}
                        size={25}
                    />
                </div>
            )}
        </div>
    )
}

export default DeleteConfirmModal