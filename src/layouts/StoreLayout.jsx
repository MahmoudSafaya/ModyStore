import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { S_Header, S_Sidebar, S_Cart, S_Footer } from '../features/store/components';
import { Helmet } from 'react-helmet-async';

const StoreLayout = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="app-layout">
            <Helmet>
                <title>Diva Store</title>
                <meta name="description" content="Discover the latest releases at the best prices, shop now and enjoy special discounts." />
                <meta name="keywords" content="diving, Diva store, scuba gear, snorkel, underwater equipment" />
                <meta name="author" content="Diva Store" />
                <meta name="robots" content="index, follow" />

                {/* <!-- Open Graph --> */}
                <meta property="og:title" content="Diva Store - Best Shopping Experience" />
                <meta property="og:description" content="Discover the latest releases at the best prices, shop now and enjoy special discounts." />
                <meta property="og:image" content="https://i.imgur.com/u82eXKK.png" />
                <meta property="og:url" content="https://divastoree.com" />
                <meta property="og:type" content="website" />

                {/* Twitter Card  */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Diva Store" />
                <meta name="twitter:description" content="Your best source for shopping experience." />
                <meta name="twitter:image" content="https://i.imgur.com/u82eXKK.png" />
            </Helmet>
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
