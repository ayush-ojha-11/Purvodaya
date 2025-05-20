import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";

import { Outlet } from "react-router-dom";
import Footer from "./components/Footer";

const App = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
      <Toaster />
    </>
  );
};

export default App;
