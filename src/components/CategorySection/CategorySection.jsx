import React from "react";
import { ArrowRight } from "lucide-react";
import "./CategorySection.css";
import Kalamkari from "../../assets/images/home/Kalamkari.jpg";
import Silks from "../../assets/images/home/silks.jpg";
import Ethinic from "../../assets/images/home/ethinic.jpg";
import AnarkaliSuit from "../../assets/images/home/anarkali-suit.jpg";
import Mens from "../../assets/images/home/mens.jpg";
import IndoWestren from "../../assets/images/home/indo-western.jpg";
import AllSalwarSet from "../../assets/images/home/all-salwar-set.jpg";
const categories = [
  {
    id: 1,
    title: "Kalamkari",
    subtitle: "Timeless weaves & elegance",
    image: Kalamkari,
    link: "/Kalamkari",
  },
  {
    id: 2,
    title: "Silks",
    subtitle: "Designed for celebrations",
    image: Silks,
    link: "/silks",
  },
  {
    id: 3,
    title: "Ethinic Wear",
    subtitle: "Graceful everyday styles",
    image: Ethinic,
    link: "/ethinic",
  },
  {
    id: 4,
    title: "Indo Westren",
    subtitle: "Classic traditional fashion",
    image: IndoWestren,
    link: "/mens",
  },
  {
    id: 5,
    title: "All Salwar Set",
    subtitle: "Made for your special day",
    image: AllSalwarSet,
    link: "/wedding",
  },
    {
    id: 6,
    title: "Mens's Wear",
    subtitle: "Made for your special day",
    image: Mens,
    link: "/mens",
  },
];

function CategorySection() {
  return (
    <section className="category-section">

      <div className="category-container">

        {/* Section Heading */}
        {/* <div className="category-heading">

          <div>
            <span className="category-eyebrow">
              DISCOVER YOUR STYLE
            </span>

            <h2>
              Shop By Category
            </h2>
          </div>

          <a
            href="/collections"
            className="category-view-all"
          >
            View All
            <ArrowRight size={17} />
          </a>

        </div> */}

        {/* Category Grid */}
        <div className="category-grid">

          {categories.map((category) => (
            <a
              key={category.id}
              href={category.link}
              className="category-card"
            >

              <div className="category-image-wrapper">

                <img
                  src={category.image}
                  alt={category.title}
                  className="category-image"
                />

                {/* <div className="category-overlay" />

                <div className="category-content">

                  <span className="category-subtitle">
                    {category.subtitle}
                  </span>

                  <h3>
                    {category.title}
                  </h3>

                  <span className="category-shop">
                    Shop Now
                    <ArrowRight size={16} />
                  </span>

                </div> */}

              </div>

              
                  <h3>
                    {category.title}
                  </h3>

            </a>
          ))}

        </div>

      </div>

    </section>
  );
}

export default CategorySection;