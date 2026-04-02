import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Results from './pages/Results';
import Compare from './pages/Compare';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/results/:username" element={<Results />} />
        <Route path="/compare/:user1/:user2" element={<Compare />} />
      </Routes>
    </Router>
  );
}

export default App;
