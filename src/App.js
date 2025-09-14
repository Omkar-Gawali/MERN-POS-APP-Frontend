import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import AdminDashboard from "./DashBoard/AdminDashboard";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import AdminRoute from "./Routes/AdminRoute";
import UserRoute from "./Routes/UserRoute";

import AdminBillsPage from "./pages/AdminBillsPage";
import UserBillsPage from "./pages/UserBillsPage";
import UserDashbaord from "./DashBoard/UserDashbaord";
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* <Route path="/dashboard" element={<AdminDashboard />} /> */}
          <Route path="/dashboard" element={<UserRoute />}>
            <Route path="user" element={<UserDashbaord />} />
            <Route path="user/bills" element={<UserBillsPage />} />
          </Route>

          <Route path="/dashboard" element={<AdminRoute />}>
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="admin/bills" element={<AdminBillsPage />} />
          </Route>

          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
