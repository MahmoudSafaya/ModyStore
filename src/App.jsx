import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { AdminProvider } from "./context/AdminContext";
import { StoreProvider } from "./context/StoreContext";
import './app.scss'
import StoreRoutes from "./routes/StoreRoutes";
import AdminRoutes from "./routes/AdminRoutes";

const App = () => {

  return (
    <Router>
      <StoreProvider>
        <AdminProvider>
          <Routes>
            {/* E-commerce Section */}
            <Route path="/*" element={<StoreRoutes />} />

            {/* Admin Section */}
            <Route path="/admin/*" element={<AdminRoutes />} />
          </Routes>
        </AdminProvider>
      </StoreProvider>
    </Router>
  );
};

export default App;
