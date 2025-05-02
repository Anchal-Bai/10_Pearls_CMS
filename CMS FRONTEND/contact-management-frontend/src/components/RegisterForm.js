import React, { useState } from 'react';
import axios from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import './Register.css'; // Link to your CSS file
import contact from '../../src/assets/svg/bird.svg'

const RegisterForm = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState(''); // For displaying error messages
  const navigate = useNavigate();

  // Update form state on input change
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Form validation before sending request
  const validateForm = () => {
    if (!form.name) {
      setError('Name is required');
      return false;
    }
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) {
      setError('Please enter a valid email');
      return false;
    }
    if (!form.password || form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    setError(''); // Reset error if all validations pass
    return true;
  };

  // Registration handler
  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return; // Prevent form submission if validation fails

    try {
      const response = await axios.post('/auth/register', form);
      alert('Registration successful');
      navigate('/login');
    } catch (error) {
      console.error("Registration error:", error.response || error); // Log the error details

      // Handle backend error responses
      if (error.response) {
        const { data } = error.response;
        if (data.error) {
          // Handle specific error messages from backend
          if (data.error === 'User already exists') {
            setError('Email is already registered');
          } else if (data.error === 'Name is invalid') {
            setError('Invalid name format');
          } else if (data.error === 'Invalid email format') {
            setError('Email is not valid');
          } else {
            setError('Registration failed. Please try again');
          }
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <div className='register-wrapper'>
    <div className="register-page">
      <div className="background-container"></div>

      <div className="register-content">
        <div className="image-container">
          <img
            src={contact} 
            alt="Contact Manager Illustration"
            className="animated-image"
          />
        </div>

        <div className="register-container">
        <button className="back-btn" onClick={() => navigate('/')}>
              &larr; Back
            </button>
          <form onSubmit={handleRegister} className="register-form">
            <h2 className="register-title">Create an Account</h2>

            {error && <div className="error-message">{error}</div>} {/* Display error message */}

            <input
              name="name"
              type="text"
              placeholder="Name"
              onChange={handleChange}
              value={form.name}
              required
              className="register-input"
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              onChange={handleChange}
              value={form.email}
              required
              className="register-input"
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
              value={form.password}
              required
              className="register-input"
            />

            <button type="submit" className="register-btn">Register</button>
            <p className="login-link">
  Already have an account? <a href="/login">Login</a>
</p>
          </form>
        </div>
      </div>
    </div>
    </div>
  );
};

export default RegisterForm;
