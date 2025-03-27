import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { A_Header, A_Sidebar } from '../features/admin/components';
import { Helmet } from 'react-helmet-async';

const AdminLayout = () => {
    const [isOpen, setIsOpen] = useState(true);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        if (window.innerHeight > window.innerWidth) {
            setIsOpen(false);
        }
    }, [])
    return (
        <div className="app-layout">
            <Helmet>
                <title>Diva Store - Dashboard</title>
                <meta name="description" content="Diva Store - Dashboard" />
                <meta name="keywords" content="Diva Store - Dashboard" />

                {/* Open Graph for social sharing */}
                <meta property="og:title" content="Diva Store - Dashboard" />
                <meta property="og:description" content="Diva Store - Dashboard" />
                <meta property="og:image" content="https://i.imgur.com/u82eXKK.png" />
                <meta property="og:url" content={`https://divastore.com/admin`} />
                <meta property="og:type" content="product" />

                {/* Twitter Card */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Diva Store - Dashboard" />
                <meta name="twitter:description" content="Diva Store - Dashboard" />
                <meta name="twitter:image" content="https://i.imgur.com/u82eXKK.png" />
            </Helmet>
            <A_Header isOpen={isOpen} toggleSidebar={toggleSidebar} />
            <A_Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
            <main className={`ml-[20px] mr-[50px] ${isOpen ? 'lg:w-[calc(100%-220px)] lg:mr-[200px] ml-[20px]' : 'lg:w-[calc(100%-70px)] lg:mr-[50px] lg:ml-[20px]'} p-4 md:p-8 bg-slate-100 h-full rounded-2xl mb-10 lg:transition-all lg:duration-500`}>
                <Outlet /> {/* Render the specific route's component */}
            </main>
        </div>
    );
};

export default AdminLayout;
