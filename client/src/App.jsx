import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";

import { Outlet } from "react-router-dom";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

const App = () => {
  return (
    <>
      <Navbar />
      <ScrollToTop />
      <Outlet />
      <Footer />
      <Toaster />
    </>
  );
};

export default App;
