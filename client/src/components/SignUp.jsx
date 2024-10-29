import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import {Link } from 'react-router-dom';


const SignUp = () => {
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate(); 

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!username || !phone || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    } 

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/register', { // Update with your API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username,
          phone,
          email,
          password,
          confirm_password: confirmPassword,
        }),
      });

      const result = await response.json();

      if (result.success) {
        navigate('/sign-in'); // Redirect to sign-in page
      } else {
        setError(result.error || 'Registration failed.');
      }
    } catch (error) {
      setError('An error occurred.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ width: '350px', padding: '20px', borderRadius: '10px', background: 'rgba(0, 0, 0, 0.6)', color: 'white' }}>
        <h1 style={{ textAlign: 'center' }}>SIGN UP</h1>
        <form onSubmit={handleSubmit}>
          <div style={{ position: 'relative', marginBottom: '15px' }}>
            <input
              type="text"
              placeholder="Full Name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid white', color: 'white', background: 'transparent' }}
              required
            />
            <i className="fa fa-user" style={{ position: 'absolute', top: '50%', right: '10px', transform: 'translateY(-50%)', color: 'white' }}></i>
          </div>

          <div style={{ position: 'relative', marginBottom: '15px' }}>
            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid white', color: 'white', background: 'transparent' }}
              required
            />
            <i className="fa fa-phone" style={{ position: 'absolute', top: '50%', right: '10px', transform: 'translateY(-50%)', color: 'white' }}></i>
          </div>

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

          <div style={{ position: 'relative', marginBottom: '15px' }}>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid white', color: 'white', background: 'transparent' }}
              required
            />
            <i
              onClick={toggleConfirmPasswordVisibility}
              className={`fa ${showConfirmPassword ? 'fa-eye' : 'fa-eye-slash'}`}
              style={{ position: 'absolute', top: '50%', right: '10px', transform: 'translateY(-50%)', color: showConfirmPassword ? 'cyan' : 'white', cursor: 'pointer' }}
            ></i>
          </div>

          {error && <div style={{ color: 'red', fontSize: '0.65em', paddingLeft: '5px' }}>{error}</div>}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <div>
              <input type="checkbox" id="checkbox1" />
              <label htmlFor="checkbox1" style={{ marginLeft: '5px' }}>Remember me</label>
            </div>
            <a href="#" style={{ color: 'cyan' }}>Forget Password?</a>
          </div>

          <button type="submit" style={{ width: '100%', padding: '10px', borderRadius: '5px', background: 'white', color: 'black', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
            SIGN UP
          </button>
        </form>
        <div style={{ textAlign: 'center', marginTop: '15px' }}>
          <p>Already have an account? <Link to="/sign-in" className="button-secondary">Sign In</Link></p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
