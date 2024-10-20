import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginScreen from "./pages/LoginScreen";
import HomeScreen from "./pages/HomeScreen";
import UserProfile from "./pages/UserProfile";
import { AuthProvider } from "./AuthContext";
import AdminScreen from "./pages/AdminScreen";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/admin" element={<AdminScreen/>}/>
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/home" element={<HomeScreen />} />
          <Route path="/" element={<LoginScreen />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
