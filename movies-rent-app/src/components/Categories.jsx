import React, { useRef } from "react";
import "../components/Categories.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Categories = ({ categories, onCategorySelect }) => {
  const categoriesContainerRef = useRef(null);

  const scrollLeft = () => {
    categoriesContainerRef.current.scrollBy({
      left: -300,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    categoriesContainerRef.current.scrollBy({
      left: 300,
      behavior: "smooth",
    });
  };

  return (
    <div className="categories-wrapper">
      <div className="arrow left-arrow" onClick={scrollLeft}>
        <FaChevronLeft />
      </div>

      <div className="categories-container" ref={categoriesContainerRef}>
        {categories.map((category, index) => (
          <div
            key={index}
            className="category-item"
            onClick={() => onCategorySelect(category.name)}
          >
            {category.name}
          </div>
        ))}
      </div>

      <div className="arrow right-arrow" onClick={scrollRight}>
        <FaChevronRight />
      </div>
    </div>
  );
};

export default Categories;
