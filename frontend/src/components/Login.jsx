import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });

  const handleFormData = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch("https://kanban-board-full-stack.onrender.com/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Login failed, please try again.");
      }
      setSuccess("Login Successful!");
      localStorage.setItem("token", data.token);

      setFormData({
        username: "",
        password: ""
      });
        setTimeout(() => {
          navigate("/tasks");
        }, 2000);
      
    } catch (error) {
      setError(error.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>LOGIN</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          name="username"
          id="username"
          value={formData.username}
          onChange={handleFormData}
          required
        />

        <label htmlFor="password">Password:</label>
        <input
          type="text"
          name="password"
          id="password"
          value={formData.password}
          onChange={handleFormData}
          required
        />
        <button className='login-button' type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        <button className='register-button' type="button" onClick={() => navigate("/register")}>
          Register Here
        </button>
        {success && <p className="success-message">{success}</p>}
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default Login;
