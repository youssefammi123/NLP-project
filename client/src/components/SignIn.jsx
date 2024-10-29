import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import axios from 'axios';  // Import axios for making HTTP requests
import { Link } from 'react-router-dom';

const SignIn = ({ setIsAuthenticated }) => {  // Receive setIsAuthenticated as a prop
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();  // Initialize useNavigate

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('/login', { email, password });
      if (response.data.success) {
        localStorage.setItem('isAuthenticated', 'true');  // Store authentication state
        setIsAuthenticated(true);  // Update authentication state
        navigate(response.data.redirect);  // Navigate to the appropriate page
      } else {
        setError(response.data.error);
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ width: '300px', padding: '20px', borderRadius: '10px', background: 'rgba(0, 0, 0, 0.6)', color: 'white' }}>
        <h1 style={{ textAlign: 'center' }}>LOGIN</h1>
        <form onSubmit={handleSubmit}>
          <div style={{ position: 'relative', marginBottom: '15px' }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid white', color: 'white', background: 'transparent' }}
              required
            />
            <i className='fa fa-envelope' style={{ position: 'absolute', top: '50%', right: '10px', transform: 'translateY(-50%)', color: 'white' }}></i>
          </div>
          <div style={{ position: 'relative', marginBottom: '15px' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid white', color: 'white', background: 'transparent' }}
              required
            />
            <i
              onClick={togglePasswordVisibility}
              className={`fa ${showPassword ? 'fa-eye' : 'fa-eye-slash'}`}
              style={{ position: 'absolute', top: '50%', right: '10px', transform: 'translateY(-50%)', color: showPassword ? 'cyan' : 'white', cursor: 'pointer' }}
            ></i>
          </div>
          {error && <div style={{ color: 'red', fontSize: '0.65em', paddingLeft: '35px' }}>{error}</div>}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <div>
              <input type="checkbox" id="checkbox" />
              <label htmlFor="checkbox" style={{ marginLeft: '5px' }}>Remember me</label>
            </div>
            <a href="#" style={{ color: 'cyan' }}>Forget Password?</a>
          </div>
          <button type="submit" style={{ width: '100%', padding: '10px', borderRadius: '5px', background: 'white', color: 'black', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
            LOGIN
          </button>
        </form>
        <div style={{ textAlign: 'center', marginTop: '15px' }}>
          <p>Don't have an account? <Link to="/sign-up" className="button-secondary">Sign Up</Link></p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
