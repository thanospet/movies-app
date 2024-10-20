import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import axios from "axios";
import "./UserProfile.css";
import { GoArrowSwitch } from "react-icons/go";
import { FaPlusCircle } from "react-icons/fa";

const UserProfile = () => {
  const { authToken } = useContext(AuthContext); 
  const [profileData, setProfileData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    wallet: 0,
  });
  const [rentals, setRentals] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [depositAmount, setDepositAmount] = useState("");
  const pageSize = 5;
  const navigate = useNavigate();

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

  const handleReturnMovie = async (uuid) => {
    try {
      const response = await axios.patch(
        `/api/rent-store/rentals/${uuid}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Movie returned:", response.data);

      // Re-fetch rentals to update
      fetchRentals(currentPage);
    } catch (error) {
      console.error("Failed to return movie", error);
    }
  };

  const handleBackToHome = () => {
    navigate("/home"); 
  };

  const fetchProfile = async () => {
    try {
      const response = await axios.get("/api/rent-store/profile", {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });
      setProfileData(response.data);
    } catch (error) {
      console.error("Failed to fetch profile", error);
    }
  };

  const handleAddFunds = async () => {
    try {
      const response = await axios.patch(
        "/api/rent-store/profile/",
        { deposit: parseFloat(depositAmount) },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Deposit response:", response.data);

      // Update profile data with new wallet balance
      setProfileData((prevData) => ({
        ...prevData,
        wallet: response.data.wallet,
      }));

      setDepositAmount("");
    } catch (error) {
      console.error("Failed to add funds", error);
    }
  };

  useEffect(() => {
    if (authToken) {
      fetchProfile();
      fetchRentals(currentPage);
    }
  }, [authToken, currentPage]);

  const handlePageChange = (page) => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
    setCurrentPage(page);
  };

  return (
    <div className="profile-container">
      <h2 className="profile-title">User Profile</h2>
      <button className="back-button" onClick={handleBackToHome}>
        Back to Home
      </button>
      <div className="profile-details">
        <div className="profile-item">
          <span className="label">Email:</span>
          <span className="value">{profileData.email}</span>
        </div>
        <div className="profile-item">
          <span className="label">First Name:</span>
          <span className="value">{profileData.first_name}</span>
        </div>
        <div className="profile-item">
          <span className="label">Last Name:</span>
          <span className="value">{profileData.last_name}</span>
        </div>
        {/* Wallet balance row with input and icon */}
        <div className="profile-item wallet-row">
          <span className="label">Wallet Balance:</span>

          <div className="funds-input-container">
            <input
              type="number"
              className="funds-input"
              value={depositAmount}
              onChange={(e) => {
                if (e.target.value >= 0) {
                  setDepositAmount(e.target.value);
                }
              }}
              placeholder="Add funds"
              min="0"
            />
            {depositAmount ? (
              <FaPlusCircle
                className="add-funds-icon"
                onClick={handleAddFunds}
                style={{ cursor: "pointer" }}
              />
            ) : <></>}
          </div>
          <span className="value">${profileData.wallet.toFixed(2)}</span>
        </div>
      </div>

      <table className="rentals-table">
        <thead>
          <tr>
            <th>Movie</th>
            <th>Rental Date</th>
            <th>Return Date</th>
            <th>Paid</th>
            <th>Charge</th>
            <th>Return</th>
          </tr>
        </thead>
        <tbody>
          {rentals.length > 0 ? (
            rentals.map((rental) => (
              <tr key={rental.uuid}>
                <td className="movie-column">{rental.movie}</td>
                <td>{rental.rental_date}</td>
                <td>{rental.return_date || "Not Returned"}</td>
                <td>{rental.is_paid ? "Yes" : "No"}</td>
                <td>${rental.charge}</td>
                <td>
                  {rental.return_date ? (
                    "Returned"
                  ) : (
                    <td>
                      <GoArrowSwitch
                        onClick={() => handleReturnMovie(rental.uuid)}
                        style={{
                          display: "flex",
                          alignSelf: "center",
                          marginLeft: 18,
                        }}
                      />
                    </td>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No rentals found</td>
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
  );
};

export default UserProfile;
