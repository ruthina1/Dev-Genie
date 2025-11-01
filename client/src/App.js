import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import GetStarted from './pages/GetStarted';
import ChatBasic from './pages/ChatBasic';
import AdvancedChat from './pages/AdvancedChat';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/get-started" element={<GetStarted />} />
          <Route path="/basic" element={<ChatBasic />} />
          <Route path="/advanced" element={<AdvancedChat />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
