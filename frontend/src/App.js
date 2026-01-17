import spotifyIcon from './spotify-icon.svg';
import './App.css';
import img from './IMG2225.jpg'
import ReleasePage from './releasePage';
import SubmissionPage from './SubmissionPage';
import HomePage from './HomePage';
import SignUpPage from './SignUp';
import DashBoard from './DashBoard';
import React from 'react';
import LogInPage from './LogIn.js';
import { Routes, Route, useNavigate} from 'react-router-dom';
import {useEffect, useState} from  'react';
import axios from 'axios';


function App() {

  const test = "hello";
  const navigate = useNavigate();

  return (
    
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LogInPage />} />
          <Route path="/:user_id/dashboard" element={<DashBoard />} />
          <Route path="/:user_id/submission" element={<SubmissionPage />} />
          <Route path="/:user_id/:release_id" element={<ReleasePage />} />
        </Routes>
      </div>
      
    
  );
}

export default App;
