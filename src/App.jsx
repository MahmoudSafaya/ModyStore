import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { StoreProvider } from "./context/StoreContext";
import { AppProvider } from "./context/AppContext";
import StoreRoutes from "./routes/StoreRoutes";
import AdminRoutes from "./routes/AdminRoutes";

const App = () => {

  return (
    <Router>
      <AppProvider>
        <Routes>
          {/* E-commerce Section */}
          <Route path="/*" element={
            <StoreProvider>
              <StoreRoutes />
            </StoreProvider>
          } />

          {/* Admin Section */}
          <Route path="/admin/*" element={
            <AuthProvider>
              <AdminRoutes />
            </AuthProvider>
          } />
        </Routes>
      </AppProvider>
    </Router >
  );
};

export default App;
