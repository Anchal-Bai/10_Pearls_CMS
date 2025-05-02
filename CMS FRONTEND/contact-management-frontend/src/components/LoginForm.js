import React, { useState } from 'react';
import axios from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css'; 
import contact from '../../src/assets/svg/bird.svg';


const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();


  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/auth/login', {
        email,
        password
      });
      // Store token and username in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', response.data.username); // Assuming backend returns username
      navigate('/contacts');
    } catch (error) {
      alert('Invalid credentials');
      console.error(error);
    }
  };

  return (
    <div className="login-wrapper">
    <div className="login-page">
      <div className="background-container"></div> 
      <div className="login-content">
        <div className="image-container">
          <img src={contact} alt="Contact Management" className="animated-image" />
        </div>
        <div className="login-container">
        <button className="back-btn" onClick={() => navigate('/')}>
              &larr; Back
            </button>
          <form onSubmit={handleLogin} className="login-form">
            <h2 className="login-title">Login</h2>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login-input"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
              required
            />
            <button type="submit" className="login-btn">Login</button>
            <p className="register-link">
  Don't have an account? <a href="/register">Register</a>
</p>
          </form>
         
        </div>
       
      </div>
    </div>
    </div>
  );
};

export default LoginForm;
