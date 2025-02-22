import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { A_Home, A_Settings, A_Login, A_NewOrder, A_Orders, A_AddProduct, A_Products, A_HandleStorage, A_UnconfirmedOrders } from "../features/admin/pages";
import { A_RequireAuth } from "../features/admin/components";
import Unauthorized from "../shared/pages/Unauthorized";
import AdminLayout from "../layouts/AdminLayout";
import { useAuth } from "../context/AdminContext";
import Loading from "../shared/components/Loading";
import NotFound from "../shared/pages/NotFound";
import { OrdersProvider } from "../context/OrdersContext";

const AdminRoutes = () => {
    const { auth, loading } = useAuth();
    if (loading) {
        return <Loading />;
    }
    return (
        <OrdersProvider>
            <Routes>
                <Route path="/login" element={auth ? <Navigate to="/admin" /> : <A_Login />} />
                <Route element={<AdminLayout />}>
                    {/* <Route element={<A_RequireAuth allowedRoles={["admin", "employee"]} />}> */}
                    <Route path="/" element={<A_Home />} />
                    <Route path="/place-order" element={<A_NewOrder />} />
                    <Route path="/orders" element={<A_Orders />} />
                    <Route path="/unconfirmed-orders" element={<A_UnconfirmedOrders />} />
                    <Route path="/add-product" element={<A_AddProduct />} />
                    <Route path="/products" element={<A_Products />} />
                    <Route path="/handle-storage" element={<A_HandleStorage />} />
                    <Route path="/unauthorized" element={<Unauthorized />} />
                    {/* </Route> */}
                    {/* <Route element={<A_RequireAuth allowedRoles={["admin"]} />}> */}
                    <Route path="/settings" element={<A_Settings />} />
                    {/* </Route> */}
                </Route>
                {/* 404 Page */}
                <Route path="/*" element={<NotFound />}></Route>
            </Routes>
        </OrdersProvider>
    );
};

export default AdminRoutes;
