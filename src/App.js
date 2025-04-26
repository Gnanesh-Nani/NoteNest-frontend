// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import NoteDetail from './pages/NoteDetail';
import './App.css'; // Import your CSS file here

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Signup />} />
        <Route path="/notes/:id" element={<NoteDetail />} />

      </Routes>
    </Router>
  );
}

export default App;
