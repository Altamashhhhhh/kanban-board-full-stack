import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/Home.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1 className="home-heading">KANBAN APP</h1>
      <button 
        onClick={() => navigate("/login")} 
        className="home-button"
      >
        LOGIN NOW
      </button>
      <button 
        onClick={() => navigate("/register")} 
        className="home-button"
      >
        REGISTER NOW
      </button>
    </div>
  );
}

export default Home;
