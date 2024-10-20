import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../AuthContext";
import "./AdminScreen.css";
import axios from "axios";
import BubbleChart from "../components/BubbleChart";

const AdminPage = () => {
  const [title, setTitle] = useState("");
  const [pubDate, setPubDate] = useState("");
  const [duration, setDuration] = useState("");
  const [rating, setRating] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [rentals, setRentals] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 5;
  const { authToken, logout } = useContext(AuthContext);

  const handleAddMovie = async (e) => {
    e.preventDefault();
    const categoriesArray = categories.split(",").map((cat) => cat.trim());

    try {
      const response = await axios.post(
        "/api/rent-store/movies",
        {
          title,
          pub_date: parseInt(pubDate),
          duration: parseInt(duration),
          rating: parseFloat(rating),
          description,
          categories: categoriesArray,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Movie added successfully:", response.data);
      setSuccess("Movie added successfully!");
      setError("");
      resetForm();
    } catch (error) {
      console.error("Error adding movie:", error);
      setError("Failed to add movie. Please check the inputs.");
    }
  };

  const resetForm = () => {
    setTitle("");
    setPubDate("");
    setDuration("");
    setRating("");
    setDescription("");
    setCategories("");
  };

  const fetchRentals = async () => {
    try {
      const response = await axios.get(
        `/api/rent-store/rentals?page=${currentPage}&page_size=${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      setRentals(response.data.results);
      setTotalPages(Math.ceil(response.data.count / pageSize));
    } catch (error) {
      console.error("Failed to fetch rentals", error);
    }
  };

  useEffect(() => {
    if (authToken) {
      fetchRentals();
    }
  }, [authToken, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="admin-page">
      <div className="top">
        <h1>Admin Page</h1>
        <button className="admin-logout" onClick={logout}>
          Sign out
        </button>
      </div>

      <div className="admin-first-row">
        <div className="admin-movie-upload-container">
          <h2>Upload a New Movie</h2>
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}

          <form onSubmit={handleAddMovie}>
            <div className="form-group">
              <label>Title:</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Publication Date (Year):</label>
              <input
                type="number"
                value={pubDate}
                onChange={(e) => setPubDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Duration (minutes):</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Rating:</label>
              <input
                type="number"
                step="0.1"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Description:</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Categories (comma-separated):</label>
              <input
                type="text"
                value={categories}
                onChange={(e) => setCategories(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="submit-button">
              Upload Movie
            </button>
          </form>
        </div>
        <div className="admin-bubble-chart-container">
          <BubbleChart />
        </div>
      </div>

      <div className="admin-second-row">
        <div className="admin-rentals-container">
          <h2>All Rentals</h2>
          <table className="rentals-table">
            <thead>
              <tr>
                <th>Movie</th>
                <th>User</th>
                <th>Rental Date</th>
                <th>Return Date</th>
                <th>Paid</th>
                <th>Charge</th>
              </tr>
            </thead>
            <tbody>
              {rentals.length > 0 ? (
                rentals.map((rental) => (
                  <tr key={rental.uuid}>
                    <td>{rental.movie}</td>
                    <td>{rental.user}</td>
                    <td>{rental.rental_date}</td>
                    <td>{rental.return_date || "Not Returned"}</td>
                    <td>{rental.is_paid ? "Yes" : "No"}</td>
                    <td>${rental.charge}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No rentals found</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="pagination-container">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={`pagination-item ${
                  index + 1 === currentPage ? "active" : ""
                }`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
