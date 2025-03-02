import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { StoreProvider } from "./context/StoreContext";
import './app.scss'
import StoreRoutes from "./routes/StoreRoutes";
import AdminRoutes from "./routes/AdminRoutes";

const App = () => {

  return (
    <Router>
      <StoreProvider>
        <AuthProvider>
          <Routes>
            {/* E-commerce Section */}
            <Route path="/*" element={<StoreRoutes />} />

            {/* Admin Section */}
            <Route path="/admin/*" element={<AdminRoutes />} />
          </Routes>
        </AuthProvider>
      </StoreProvider>
    </Router>
  );
};

export default App;
