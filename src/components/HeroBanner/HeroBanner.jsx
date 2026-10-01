 
import React from "react";
import { Link } from "react-router-dom";
import "./HeroBanner.css";

import heroBanner from "../../assets/images/home/hero-banner.png";
import heroBannerMobile from "../../assets/images/home/hero-banner-mobile.png";

function HeroBanner() {
  return (
    <section className="hero-banner">
      <Link to="/products" className="hero-banner-link">
        <picture className="hero-banner-picture">
          {/* Mobile image */}
          <source
            media="(max-width: 767px)"
            srcSet={heroBannerMobile}
          />

          {/* Desktop / Tablet image */}
          <img
            src={heroBanner}
            alt="Sogasari Collection"
            className="hero-banner-image"
          />
        </picture>
      </Link>
    </section>
  );
}

export default HeroBanner;
 
