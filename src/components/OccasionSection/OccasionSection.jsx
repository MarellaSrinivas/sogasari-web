import React from "react";
import { ArrowRight } from "lucide-react";
import "./OccasionSection.css";
import wedding from "../../assets/images/occasions/wedding.jpg";
import festive from "../../assets/images/occasions/festive.jpg";
import party from "../../assets/images/occasions/partywear.jpg";
import haldi from "../../assets/images/occasions/haldi.jpg";
import pooja from "../../assets/images/occasions/pooja.jpg";
import cocktail from "../../assets/images/occasions/coaktail.jpg"; 

const occasions = [
  {
    id: 1,
    title: "Wedding",
    subtitle: "For your most cherished moments",
    image: wedding,
    link: "/collections/wedding",
  },
  {
    id: 2,
    title: "Festive",
    subtitle: "Celebrate in timeless style",
    image: festive,
    link: "/collections/festive",
  },
  {
    id: 3,
    title: "Party Wear",
    subtitle: "Make every entrance memorable",
    image: party,
    link: "/collections/party-wear",
  },
  {
    id: 4,
    title: "Pooja Wear",
    subtitle: "Your dream day, your dream look",
    image: pooja,
    link: "/collections/bridal",
  },
  {
    id: 5,
    title: "Haldi Wear",
    subtitle: "Effortless elegance, every day",
    image: haldi,
    link: "/collections/everyday",
  },
  {
    id: 6,
    title: "Cocktail Wear",
    subtitle: "Effortless elegance, every day",
    image: cocktail,
    link: "/collections/everyday",
  },
];

function OccasionSection() {
  return (
    <section className="occasion-section">

      <div className="occasion-container">

        {/* Heading */}
        <div className="occasion-heading">

          <div>
            <span className="occasion-eyebrow">
              DRESS FOR THE MOMENT
            </span>

            <h2>
              Shop By Occasion
            </h2>
          </div>

          <p>
            Discover carefully curated styles for
            every celebration and special moment.
          </p>

        </div>

        {/* Occasion Grid */}
        <div className="occasion-grid">

          {occasions.map((occasion) => (
            <a
              href={occasion.link}
              className={`occasion-card occasion-card-${occasion.id}`}
              key={occasion.id}
            >

              <img
                src={occasion.image}
                alt={occasion.title}
                className="occasion-image"
              />

              <div className="occasion-overlay" />

              <div className="occasion-content">

                <span className="occasion-subtitle">
                  {occasion.subtitle}
                </span>

                <h3>
                  {occasion.title}
                </h3>

                <span className="occasion-link">
                  Explore
                  <ArrowRight size={16} />
                </span>

              </div>

            </a>
          ))}

        </div>

      </div>

    </section>
  );
}

export default OccasionSection;