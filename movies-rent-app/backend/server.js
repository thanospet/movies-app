const express = require("express");
const request = require("request");

const app = express();
const API_URL = "http://3.235.214.44:8000"; // Backend API URL

app.use(express.json());

// CORS Middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Authorization, Content-Type");
  res.header("Cache-Control", "no-cache, no-store, must-revalidate");
  res.header("Pragma", "no-cache");
  res.header("Expires", "0");
  next();
});

app.get("/", (req, res) => {
  //serve the app
});

app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;

  const url = `${API_URL}/auth/login/`;
  request.post(
    {
      url: url,
      json: true,
      body: { username, password },
      headers: {
        "Content-Type": "application/json",
      },
    },
    (error, response, body) => {
      if (error || response.statusCode !== 200) {
        return res.status(500).json({ type: "error", message: error.message });
      }

      res.json(body);
    }
  );
});

app.get("/api/rent-store/movies", (req, res) => {
  const page = req.query.page || 1;
  const pageSize = req.query.page_size || 12;

  const authHeader = req.header("Authorization");

  const url = `${API_URL}/rent-store/movies/?page=${page}&page_size=${pageSize}`;
  request(
    {
      url: url,
      headers: {
        Authorization: authHeader, 
        "Content-Type": "application/json",
      },
    },
    (error, response, body) => {
      if (error || response.statusCode !== 200) {
        return res.status(500).json({ type: "error", message: "error" });
      }

      res.json(JSON.parse(body));
    }
  );
});

app.get("/api/rent-store/categories", (req, res) => {
  const authHeader = req.header("Authorization");

  const url = `${API_URL}/rent-store/categories/`;
  request(
    {
      url: url,
      headers: {
        Authorization: authHeader, // Forward Authorization header
        "Content-Type": "application/json",
        "Cache-Control": "no-cache", // Disable caching
        Pragma: "no-cache", // Disable caching
        Expires: "0", // Expire immediatel
      },
    },
    (error, response, body) => {
      if (error || response.statusCode !== 200) {
        return res.status(500).json({ type: "error", message: "error" });
      }

      res.json(JSON.parse(body));
    }
  );
});

app.get("/api/rent-store/profile", (req, res) => {
  const authHeader = req.header("Authorization");

  const url = `${API_URL}/rent-store/profile/`;
  request(
    {
      url: url,
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
    },
    (error, response, body) => {
      if (error || response.statusCode !== 200) {
        return res.status(500).json({ type: "error", message: "error" });
      }

      res.json(JSON.parse(body));
    }
  );
});

app.post("/api/rent-store/rentals", (req, res) => {
  const authHeader = req.header("Authorization");
  const { movie } = req.body; // Get the movie UUID from the React request body
  console.log("Received movie UUID:", movie);
  console.log("Received auth token:", authHeader);

  const url = `${API_URL}/rent-store/rentals/`;
  request.post(
    {
      url: url,
      json: true,
      body: { movie }, // Use the movie UUID passed from the client (React app)
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
    },
    (error, response, body) => {
      console.log("error",error)
      console.log("response",response.data)
      if (error) {
        return res.status(500).json({ type: "error", message: "error" });
      }
      
      res.json(body); // No need to parse body again if already in JSON
    }
  );
});

app.get("/api/rent-store/rentals", (req, res) => {
  const authHeader = req.header("Authorization");
  const page = req.query.page || 1;
  const pageSize = req.query.page_size || 5;

  const url = `${API_URL}/rent-store/rentals/?page=${page}&page_size=${pageSize}`;
  request(
    {
      url: url,
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
    },
    (error, response, body) => {
      if (error || response.statusCode !== 200) {
        return res
          .status(500)
          .json({ type: "error", message: "Error fetching rentals" });
      }
      res.json(JSON.parse(body));
    }
  );
});

app.patch("/api/rent-store/rentals/:uuid", (req, res) => {
  const authHeader = req.header("Authorization");
  const { uuid } = req.params;

  const url = `${API_URL}/rent-store/rentals/${uuid}`; 

  request.patch(
    {
      url: url,
      headers: {
        Authorization: authHeader, 
        "Content-Type": "application/json",
      },
      json: true,
    },
    (error, response, body) => {
      if (error || response.statusCode !== 200) {
        console.error("Error in external API PATCH request:", error || body);
        return res
          .status(500)
          .json({ type: "error", message: "Error returning movie" });
      }

      console.log("Movie returned successfully:", body);
      res.status(200).json(body); 
    }
  );
});

app.patch("/api/rent-store/profile/", (req, res) => {
  const authHeader = req.header("Authorization");
  const { deposit } = req.body; // Read deposit from the request body

  if (!deposit || deposit <= 0) {
    return res.status(400).json({ message: "Invalid deposit amount" });
  }

  const url = `${API_URL}/rent-store/profile/`; // Correct URL without the deposit in the URL

  request.patch(
    {
      url: url,
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      body: { deposit }, // Send deposit amount in the body
      json: true,
    },
    (error, response, body) => {
      if (error || response.statusCode !== 200) {
        console.error("Error in external API PATCH request:", error || body);
        return res
          .status(500)
          .json({ type: "error", message: "Error adding funds" });
      }

      console.log("Amount added successfully:", body);
      res.status(200).json(body); // Send the updated profile data back to the client
    }
  );
});

app.post("/api/rent-store/movies", (req, res) => {
  const authHeader = req.header("Authorization");
  const { title, pub_date, duration, rating, description, categories } = req.body;

  const url = `${API_URL}/rent-store/movies/`;

  request.post(
    {
      url: url,
      json: true,
      body: {
        title,
        pub_date,
        duration,
        rating,
        description,
        categories
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader, 
      },
    },
    (error, response, body) => {
      if (error || response.statusCode !== 201) {
        console.error("Error adding movie:", error || body);
        return res.status(500).json({ message: "Error adding movie" });
      }

      res.status(201).json(body);
    }
  );
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () =>
  console.log(`Proxy server running on http://localhost:${PORT}`)
);
