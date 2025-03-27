import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import {  A_RequireAuth } from "../features/admin/components";
import Unauthorized from "../shared/pages/Unauthorized";
import AdminLayout from "../layouts/AdminLayout";
import Loading from "../shared/components/Loading";
import NotFound from "../shared/pages/NotFound";
import { OrdersProvider } from "../context/OrdersContext";
import { useAuth } from "../context/AuthContext";

// Lazy-loaded admin pages
const A_Home = lazy(() => import("../features/admin/pages/Home"));
const A_Settings = lazy(() => import("../features/admin/pages/Settings"));
const A_Login = lazy(() => import("../features/admin/pages/Login"));
const A_NewOrder = lazy(() => import("../features/admin/pages/NewOrder"));
const A_Orders = lazy(() => import("../features/admin/pages/Orders"));
const A_AddProduct = lazy(() => import("../features/admin/pages/AddProduct/AddProduct"));
const A_Products = lazy(() => import("../features/admin/pages/Products"));
const A_HandleStorage = lazy(() => import("../features/admin/pages/HandleStorage"));
const A_UnconfirmedOrders = lazy(() => import("../features/admin/pages/UnconfirmedOrders"));
const A_TrackOrder = lazy(() => import("../features/admin/pages/TrackOrder"));

const AdminRoutes = () => {
    const { auth } = useAuth();

    return (
        <OrdersProvider>
            <Suspense fallback={<Loading />}>
                <Routes>
                    <Route path="/login" element={auth ? <Navigate to="/admin" /> : <A_Login />} />
                    <Route element={<AdminLayout />}>
                        {/* Routes for both Admin and User */}
                        <Route element={<A_RequireAuth allowedRoles={["admin", "user"]} />}>
                            <Route path="/place-order" element={<A_NewOrder />} />
                            <Route path="/orders" element={<A_Orders />} />
                            <Route path="/unconfirmed-orders" element={<A_UnconfirmedOrders />} />
                            <Route path="/track-order" element={<A_TrackOrder />} />
                            <Route path="/unauthorized" element={<Unauthorized />} />
                        </Route>

                        {/* Admin-only Routes */}
                        <Route element={<A_RequireAuth allowedRoles={["admin"]} />}>
                            <Route path="/" element={<A_Home />} />
                            <Route path="/add-product" element={<A_AddProduct />} />
                            <Route path="/products" element={<A_Products />} />
                            <Route path="/handle-storage" element={<A_HandleStorage />} />
                            <Route path="/settings" element={<A_Settings />} />
                        </Route>
                    </Route>

                    {/* Redirect users trying to access "/" to "/place-order" */}
                    <Route path="/" element={<Navigate to="/place-order" />} />

                    {/* 404 Page */}
                    <Route path="/*" element={<NotFound />} />
                </Routes>
            </Suspense>
        </OrdersProvider>
    );
};

export default AdminRoutes;