import React, { useState } from 'react';
import axios from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css'; 
import contact from '../../src/assets/svg/bird.svg';


const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const generateBoxShadow = (index) => {
    const colors = [
      ["rgb(0, 28, 46)", "rgb(96 165 250)", "rgb(94 234 212)"],
      ["rgb(0, 28, 46)", "rgb(94 234 212)", "rgb(96 165 250)"],
      ["rgb(94 234 212)", "rgb(0, 28, 46)", "rgb(96 165 250)"],
      ["rgb(94 234 212)", "rgb(96 165 250)", "rgb(0, 28, 46)"],
      ["rgb(96 165 250)", "rgb(94 234 212)", "rgb(0, 28, 46)"],
      ["rgb(96 165 250)", "rgb(0, 28, 46)", "rgb(94 234 212)"],
    ];
    const r = Math.floor(Math.random() * 6);
    const [c1, c2, c3] = colors[r];
    return `-130px 0 80px 40px white, -50px 0 50px 25px ${c1}, 0 0 50px 25px ${c2}, 50px 0 50px 25px ${c3}, 130px 0 80px 40px white`;
  };
  
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/auth/login', {
        email,
        password
      });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', response.data.username); 
      navigate('/contacts');
    } catch (error) {
      alert('Invalid credentials');
      console.error(error);
    }
  };

  return (
    <div className="login-wrapper">
    <div className="login-page">
    <div className="background-container">
  {[...Array(25)].map((_, i) => (
    <div key={i} className="rainbow" style={{
      animationDelay: `-${(i / 25) * 45}s`,
      animationDuration: `${45 - (45 / 25 / 2 * i)}s`,
      boxShadow: generateBoxShadow(i)
    }} />
  ))}
  <div className="h" />
  <div className="v" />
</div>
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
