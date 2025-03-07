import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { A_Home, A_Settings, A_Login, A_NewOrder, A_Orders, A_AddProduct, A_Products, A_HandleStorage, A_UnconfirmedOrders, A_TrackOrder } from "../features/admin/pages";
import { A_RequireAuth } from "../features/admin/components";
import Unauthorized from "../shared/pages/Unauthorized";
import AdminLayout from "../layouts/AdminLayout";
import Loading from "../shared/components/Loading";
import NotFound from "../shared/pages/NotFound";
import { OrdersProvider } from "../context/OrdersContext";
import { useAuth } from "../context/AuthContext";

const AdminRoutes = () => {
    const { auth, loading } = useAuth();
    
    if (loading) {
        return <Loading loading={loading} />;
    }
    return (
        <OrdersProvider>
            <Routes>
                <Route path="/login" element={auth ? <Navigate to="/admin" /> : <A_Login />} />
                <Route element={<AdminLayout />}>
                    <Route element={<A_RequireAuth allowedRoles={["admin", "user"]} />}>
                        <Route path="/" element={<A_Home />} />
                        <Route path="/place-order" element={<A_NewOrder />} />
                        <Route path="/orders" element={<A_Orders />} />
                        <Route path="/unconfirmed-orders" element={<A_UnconfirmedOrders />} />
                        <Route path="/track-order" element={<A_TrackOrder />} />
                        <Route path="/unauthorized" element={<Unauthorized />} />
                    </Route>
                    <Route element={<A_RequireAuth allowedRoles={["admin"]} />}>
                        <Route path="/add-product" element={<A_AddProduct />} />
                        <Route path="/products" element={<A_Products />} />
                        <Route path="/handle-storage" element={<A_HandleStorage />} />
                        <Route path="/settings" element={<A_Settings />} />
                    </Route>
                </Route>
                {/* 404 Page */}
                <Route path="/*" element={<NotFound />}></Route>
            </Routes>
        </OrdersProvider>
    );
};

export default AdminRoutes;
