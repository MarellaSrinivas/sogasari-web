import React from "react";
import Header from "../../components/Header/Header";
import HeroBanner from "../../components/HeroBanner/HeroBanner";
import CategorySection from "../../components/CategorySection/CategorySection";
import OccasionSection from "../../components/OccasionSection/OccasionSection";
import NewArrivals from "../../components/NewArrivals/NewArrivals";
import BestSellers from "../../components/BestSellers/BestSellers";
import "./Home.css";

function Home() {
  return (
    <div className="home-page">

      {/* Header */}
      <Header />

      {/* Hero */}
      <HeroBanner />

      {/* Shop By Category */}
   {/* <CategorySection /> */}

      {/* Shop By Occasion */}
     {/* <OccasionSection /> */}

      {/* New Arrivals */}
  <NewArrivals />

      {/* Best Sellers */}
      <BestSellers />

      {/* Featured Collections */}
      <section className="home-section-placeholder">
        <h2>Featured Collections</h2>
        <p>Collections section coming next</p>
      </section>

      {/* Shop By Craft */}
      <section className="home-section-placeholder">
        <h2>Shop By Craft</h2>
        <p>Craft section coming next</p>
      </section>

      {/* Sogasari Story */}
      <section className="home-section-placeholder">
        <h2>The Sogasari Story</h2>
        <p>Story section coming next</p>
      </section>

      {/* Reviews */}
      <section className="home-section-placeholder">
        <h2>Customer Reviews</h2>
        <p>Reviews section coming next</p>
      </section>

      {/* FAQ */}
      <section className="home-section-placeholder">
        <h2>Frequently Asked Questions</h2>
        <p>FAQ section coming next</p>
      </section>

    </div>
  );
}

export default Home;