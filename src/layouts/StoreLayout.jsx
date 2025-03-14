import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { S_Header, S_Sidebar, S_Cart, S_Footer } from '../features/store/components';

const StoreLayout = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="app-layout">
            <S_Header toggleSidebar={toggleSidebar} />
            <S_Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
            <S_Cart />
            <main className={`w-full lg:w-[calc(100%-50px)] lg:mr-[50px] pb-12 bg-slate-100 h-full`}>
                <Outlet /> {/* Render the specific route's component */}
            </main>
            <S_Footer />
        </div>
    );
};

export default StoreLayout;
