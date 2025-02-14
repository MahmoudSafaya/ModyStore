import { Outlet } from 'react-router-dom';
import { S_Header, S_Sidebar, S_Cart, S_Footer } from '../features/store/components';
import { useState } from 'react';

const StoreLayout = () => {
    const [isCartOpen, setIsCartOpen] = useState(false);

    const toggleCart = () => {
        setIsCartOpen(!isCartOpen)
    }

    return (
        <div className="app-layout">
            <S_Header toggleCart={toggleCart} />
            <S_Sidebar />
            <S_Cart isCartOpen={isCartOpen} toggleCart={toggleCart} />
            <main className={`w-full lg:w-[calc(100%-50px)] lg:mr-[50px] p-4 md:p-8 pt-8 bg-slate-100 h-full mb-10`}>
                <Outlet /> {/* Render the specific route's component */}
            </main>
            <S_Footer />
        </div>
    );
};

export default StoreLayout;
