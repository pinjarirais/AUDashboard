import { Outlet } from 'react-router-dom';
import Header from './header';
import Footer from './footer';

const AuthLayout = () => {
  // ... perhaps some authentication logic to protect routes?
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};

export default AuthLayout
