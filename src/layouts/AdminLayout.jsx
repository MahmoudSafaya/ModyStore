import { useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { A_Header, A_Sidebar } from '../features/admin/components';
import { useAuth } from '../context/AdminContext';

const AdminLayout = () => {
    const { auth } = useAuth();
    const [isOpen, setIsOpen] = useState(true);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    // if (!auth) {
    //     return <Navigate to="/admin/login" />;
    // }

    useEffect(() => {
        if (window.innerHeight > window.innerWidth) {
            setIsOpen(false);
        }
    }, [])
    return (
        <div className="app-layout">
            <A_Header isOpen={isOpen} toggleSidebar={toggleSidebar} />
            <A_Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
            <main className={`ml-[20px] mr-[50px] ${isOpen ? 'lg:w-[calc(100%-220px)] lg:mr-[200px] ml-[20px]' : 'lg:w-[calc(100%-70px)] lg:mr-[50px] lg:ml-[20px]'} p-4 md:p-8 bg-slate-100 h-full rounded-2xl mb-10 lg:transition-all lg:duration-500`}>
                <Outlet /> {/* Render the specific route's component */}
            </main>
        </div>
    );
};

export default AdminLayout;
