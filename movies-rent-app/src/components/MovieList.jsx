import React, { useState, useContext } from "react";
import "./MovieList.css";
import defaultImage from "../assets/ghost.png";
import Modal from "./Modal";
import axios from "axios";
import { AuthContext } from "../AuthContext";

const Card = ({ movie, onClick }) => {
  return (
    <div className="movie-card">
      <img
        className="movie-card-img"
        src={movie.poster_url || defaultImage} // Fallback image if poster_url is null
        alt={movie.title}
        onError={(e) => {
          e.target.src = defaultImage; // If the image fails to load, use the default image
        }}
      />
      <div className="movie-card-body">
        <p className="movie-card-title">{movie.title}</p>
      </div>
    </div>
  );
};
// MovieList component
const MovieList = ({ movies }) => {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const { authToken } = useContext(AuthContext);
  console.log("showModal", showModal);
  console.log("selectedMovie", selectedMovie);

  const handleMovieClick = (movie) => {
    console.log("clicked", showModal);
    setSelectedMovie(movie); // Store the selected movie data
    setShowModal(true); // Show the modal
    setSuccessMessage("");
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedMovie(null);
  };

  const handleRentMovie = async () => {
    if (!authToken || !selectedMovie) {
      console.error("Missing auth token or selected movie");
      return;
    }
    console.log("Selected Movie UUID:", selectedMovie.uuid);
    try {
      const response = await axios.post(
        "/api/rent-store/rentals",
        { movie: selectedMovie.uuid },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        // Successfully rented the movie
        setSuccessMessage("Movie rented successfully!");
        console.log("Movie rented successfully:", response.data);
      } else {
        // Handle unexpected status codes
        console.warn("Unexpected response status:", response.status);
      }
    } catch (error) {
      if (error.response) {
        console.error("Error during rent:", error.response.data);
      } else {
        console.error("Unexpected error:", error.message);
      }
    }
  };

  return (
    <>
      <div className="movie-list">
        {movies.map((movie) => (
          <span onClick={() => handleMovieClick(movie)}>
            <Card key={movie.uuid} movie={movie} />
          </span>
        ))}
      </div>
      {selectedMovie && (
        <Modal show={showModal} onClose={handleCloseModal}>
          <img
            className="modal-img"
            src={
              selectedMovie.poster_url ? selectedMovie.poster_url : defaultImage
            }
            alt={selectedMovie.title}
            onError={(e) => {
              e.target.src = defaultImage;
            }}
          />
          <h2>{selectedMovie?.title}</h2>
          <div className="movie-categories">
            {selectedMovie.categories && selectedMovie.categories.length > 0 ? (
              selectedMovie.categories.map((category, index) => (
                <span key={index} className="category-badge">
                  {category}
                </span>
              ))
            ) : (
              <p>No categories available</p>
            )}
          </div>
          <p>{selectedMovie?.description}</p>
          <div className="details">
            <h4>
              Rating:&nbsp;
              <span className="details-span">{selectedMovie?.rating} / 10</span>
            </h4>
            <h4>
              Duration:&nbsp;
              <span className="details-span">
                {selectedMovie?.duration} min
              </span>
            </h4>
          </div>
          {successMessage ? (
            <p className="success-message">{successMessage}</p>
          ) : (
            <button className="rent-btn" onClick={handleRentMovie}>
              Rent
            </button>
          )}
        </Modal>
      )}
    </>
  );
};

export default MovieList;
