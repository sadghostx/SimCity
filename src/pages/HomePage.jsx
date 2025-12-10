import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="homepage-content">
      <h1>SimCity BuildIt Companion App</h1>
      <p>Select a tool to manage and optimize your city.</p>
      
      <div className="homepage-links">
        <Link to="/tracker">📊 Resource Tracker</Link>
        <Link to="/layout">🏗️ Layout Planner</Link>
        <Link to="/guides">📚 Building Guides</Link>
      </div>
    </div>
  );
};

export default HomePage;