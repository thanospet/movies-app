import { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import MovieList from "../components/MovieList";
import Categories from "../components/Categories";
import axios from "axios";
import "./HomeScreen.css";
import { AuthContext } from "../AuthContext";
import ProfileModal from "../components/ProfileModal";

function HomeScreen() {
  const navigate = useNavigate();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [movies, setMovies] = useState([]);
  const [categories, setCategories] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(""); 
  const [_token, setToken] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(12);
  const pageSize = 12;
  const { authToken, logout } = useContext(AuthContext);

  const handleCloseProfileModal = () => {
    setShowProfileModal(false);
  };

  const handleGetMovies = async () => {
    if (!authToken) {
      return;
    }
    try {
      const response = await axios.get(
        `/api/rent-store/movies?page=${currentPage}&page_size=${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("movies", response.data);
      setMovies(response.data.results);
      setTotalPages(Math.ceil(response.data.count / pageSize));
    } catch (error) {
      console.error("Failed to fetch movies", error);
    }
  };

  const handleGetCategories = async () => {
    if (!authToken) {
      return;
    }
    try {
      const response = await axios.get("/api/rent-store/categories", {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });
      setCategories(response.data);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };

  const handleProfile = async () => {
    if (!authToken) {
      return;
    }
    try {
      const response = await axios.get("/api/rent-store/profile", {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });
      console.log("profile", response.data);
      navigate("/profile");
    } catch (error) {
      console.error("Failed to fetch profile", error);
    }
  };

  useEffect(() => {
    if (!authToken) {
      navigate("/login");
    } else {
      handleGetMovies();
      handleGetCategories();
    }
  }, [authToken, currentPage]);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleGoToStart = () => {
    setCurrentPage(1);
  };

  const filteredMovies = selectedCategory
    ? movies.filter((movie) => movie.categories.includes(selectedCategory))
    : movies;

  return (
    <>
      <div className="header">
        <h2 className="header-title">Deus Movies</h2>
        <button
          className="profile-button"
          onClick={() => setShowProfileModal(true)}
        >
          My Profile
        </button>
      </div>
      <div className="container">
        <div>
          <h2 className="categories-title">Browse by category</h2>
        </div>
        {categories.length > 0 ? (
          <Categories
            categories={categories}
            onCategorySelect={(category) => {
              setSelectedCategory(category);
            }}
          />
        ) : (
          <p>No categories found</p>
        )}

        {selectedCategory && (
          <div className="clear-filter-container">
            <span>Filtered by: {selectedCategory}</span>
            <button
              className="clear-filter-button"
              onClick={() => setSelectedCategory("")}
            >
              Clear Filter
            </button>
          </div>
        )}

        <div className="movie-list-container">
          {filteredMovies.length > 0 ? (
            <MovieList movies={filteredMovies} />
          ) : (
            <p>No movies found</p>
          )}
        </div>

        <div className="pagination-container">
          <button
            className="pagination-button"
            onClick={handleGoToStart}
            disabled={currentPage === 1}
          >
            Page 1
          </button>
          <button
            className="pagination-button"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="pagination-info">
            Page {currentPage} / {totalPages}
          </span>
          <button
            className="pagination-button"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>

        <ProfileModal show={showProfileModal} onClose={handleCloseProfileModal}>
          <button
            className="profile-modal-button"
            onClick={() => handleProfile(authToken)}
          >
            View profile
          </button>
          <button className="profile-modal-button" onClick={logout}>
            Sign out
          </button>
        </ProfileModal>
      </div>
    </>
  );
}

export default HomeScreen;
