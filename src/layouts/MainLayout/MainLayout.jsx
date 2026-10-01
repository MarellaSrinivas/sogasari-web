import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

import "./MainLayout.css";

function MainLayout({ children }) {
  return (
    <div className="main-layout">
      <Header />

      <main className="main-content">
        {children}
      </main>

      <Footer />
    </div>
  );
}

export default MainLayout;