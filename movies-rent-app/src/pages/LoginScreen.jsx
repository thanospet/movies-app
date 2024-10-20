import { useState,useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LoginScreen.css';
import { AuthContext } from '../AuthContext';

function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/auth/login', { username, password });
      const token = response.data.access;
      console.log("[login token]", response.data.access)
      login(token);

      navigate('/home');
    } catch (error) {
      setError('Login failed! Please check your credentials.');
    }
  };

  return (
    <div className="login-screen">
     <h1>Deus Movies</h1>
    <div className="login-box">
      <h2 className="login-title">Sign in</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <button type="submit" className="login-button">Go</button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  </div>
  );
}

export default LoginScreen;
