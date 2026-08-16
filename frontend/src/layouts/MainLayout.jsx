import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import AIChat from "../components/common/AIChat";

function MainLayout({ children }) {
  return (
    <>
      <Navbar />

      <main>{children}</main>

      <Footer />

      <AIChat />
    </>
  );
}

export default MainLayout;