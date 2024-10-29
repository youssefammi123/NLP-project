import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';  // Import useEffect for checking authentication on load
import Layout from './components/Layout'; // Import the Layout component
import LandingPage from './components/LandingPage';
import Main from './components/Main';
import QuestionGeneration from './components/QuestionGeneration';
import ResumeQuest from './components/ResumeQuest'; // Import the new component
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import PrivateRoute from './components/PrivateRoute'; // Import the PrivateRoute component

function App() {
  // Step 1: Retrieve authentication state from localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  // Step 2: Handle authentication state change
  const handleAuthenticationChange = (authStatus) => {
    setIsAuthenticated(authStatus);
    localStorage.setItem('isAuthenticated', authStatus ? 'true' : 'false');
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
          
          {/* Protected routes that require authentication */}
          <Route path="resume-match" element={<PrivateRoute element={<Main />} />} />
          <Route path="quest-ai" element={<PrivateRoute element={<QuestionGeneration />} />} />
          <Route path="resume-quest" element={<PrivateRoute element={<ResumeQuest />} />} />
          
          {/* Public routes */}
          <Route path="/sign-in" element={<SignIn setIsAuthenticated={handleAuthenticationChange} />} /> 
          <Route path="/sign-up" element={<SignUp />} /> 
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
