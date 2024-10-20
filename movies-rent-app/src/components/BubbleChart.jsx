import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import "./BubbleChart.css"
import { AuthContext } from '../AuthContext';
import { Bubble } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, PointElement, LinearScale } from 'chart.js';

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, PointElement, LinearScale);

const BubbleChart = () => {
  const [bubbleData, setBubbleData] = useState([]);
  const { authToken } = useContext(AuthContext);

  // Function to count occurrences of each year
  const countMoviesByYear = (movies) => {
    const yearCount = new Map(); 

    movies.forEach((movie) => {
      const pubDate = movie.pub_date;
      console.log("Movie Title:", movie.title, "Publication Date:", pubDate);

      if (pubDate) {
        const year = parseInt(pubDate, 10);
        console.log("Extracted Year:", year);

        if (!isNaN(year) && year > 1850 && year <= new Date().getFullYear()) {
          // If year is valid, increment the count, otherwise initialize at 1
          yearCount.set(year, (yearCount.get(year) || 0) + 1);
        }
      } else {
        console.warn("Movie has invalid or missing pub_date:", movie);
      }
    });

    return yearCount;
  };

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(`/api/rent-store/movies?page=${1}&page_size=${9999}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        const movies = response.data.results;
        console.log("Movies data from API:", movies);

        // Count movies by year
        const yearCount = countMoviesByYear(movies);
        console.log("Year Count Map:", yearCount); 

        // Convert the Map object into chart data (array)
        const chartData = Array.from(yearCount).map(([year, count]) => ({
          y: year,
          x: count,
          r: count * 3, 
        }));

        setBubbleData(chartData);
      } catch (error) {
        console.error('Error fetching movies for bubble chart', error);
      }
    };

    fetchMovies();
  }, [authToken]);

  // Bubble chart configuration
  const bubbleChartData = {
    datasets: [
      {
        label: 'Movies per Year',
        data: bubbleData,
        backgroundColor: 'rgba(54, 162, 100, 0.6)',
      },
    ],
  };

  const bubbleChartOptions = {
    scales: {
      x: {
        title: {
          display: true,
          text: 'Number of Movies',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Year',
        },
        ticks: {
            stepSize: 10,
          },
      },
    },
  };

  return (
    <div className="bubble-chart-container">
      <h2>Movies per Publication Year</h2>
      <Bubble data={bubbleChartData} options={bubbleChartOptions} />
    </div>
  );
};

export default BubbleChart;
