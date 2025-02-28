import { Outlet } from "react-router-dom";
import Header from "./header";
import Footer from "./footer";
import { DataProvider } from "./dataProvider";

const AuthLayout = () => {
  // ... perhaps some authentication logic to protect routes?

  return (
    <>
      <DataProvider>
        <Header />
        <Outlet />
        <Footer />
      </DataProvider>
    </>
  );
};

export default AuthLayout;
