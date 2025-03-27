import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { StoreProvider } from "./context/StoreContext";
import { AppProvider } from "./context/AppContext";
import { lazy, Suspense } from "react";
import Loading from "./shared/components/Loading";

const StoreRoutes = lazy(() => import("./routes/StoreRoutes"));
const AdminRoutes = lazy(() => import("./routes/AdminRoutes"));

const App = () => {

  return (
    <Router>
      <AppProvider>
        <Routes>
          {/* E-commerce Section */}
          <Route path="/*" element={
            <StoreProvider>
               <Suspense fallback={<Loading />}>
                <StoreRoutes />
              </Suspense>
            </StoreProvider>
          } />

          {/* Admin Section */}
          <Route path="/admin/*" element={
            <AuthProvider>
              <Suspense fallback={<Loading />}>
                <AdminRoutes />
              </Suspense>
            </AuthProvider>
          } />
        </Routes>
      </AppProvider>
    </Router >
  );
};

export default App;
