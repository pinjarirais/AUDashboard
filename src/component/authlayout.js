import { Outlet, Navigate } from "react-router-dom";
import Header from "./header";
import Footer from "./footer";
import { DataProvider } from "./dataProvider";

const AuthLayout = () => {
  // ... perhaps some authentication logic to protect routes?
  const token = localStorage.getItem("token");
  return token ? (
    <>
      <DataProvider>
        <Header />
        <Outlet />
        <Footer />
      </DataProvider>
    </>
  ) : <Navigate to="/" replace />;
};

export default AuthLayout;
