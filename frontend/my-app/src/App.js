import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FrontPage from './FrontPage';
import SemanticSearch from './SemanticSearch';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FrontPage />} />
        <Route path="/semantic-search" element={<SemanticSearch />} />
      </Routes>
    </Router>
  );
}

export default App;
