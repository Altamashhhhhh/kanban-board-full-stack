import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../style/Register.css";
import { useToast } from '@chakra-ui/react';

const Register = () => {
    const navigate = useNavigate();
    const toast = useToast()
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const [formData, setFormData] = useState({
        username: "",
        role: "user",
        password: ""
    });

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);
        
        try {
            const response = await fetch("https://kanban-board-full-stack.onrender.com/user/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                toast({
                    status:"error",
                    title : "Error while registering new user ",
                    isClosable : true , 
                    duration: 3000,
                })
                throw new Error(data.message);
            }
            if(response.ok){
                toast({
                    title:"User Registration Successful" , 
                    isClosable : true , 
                    duration : 3000 , 
                    status : "success"
                })
                setSuccess("User Registration Successful");
            }
            setFormData({
                username: "",
                role: "user",
                password: ""
            });

                setTimeout(() => {
                    navigate("/login")
                }, 600);

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleFormData = (event) => {
        const { name, value } = event.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    return (
        <div className="container">
            <h1 className="heading">Registration Form</h1>
            <form onSubmit={handleSubmit} className="form">
                <label htmlFor="username" className="label">Username:</label>
                <input 
                    type="text" 
                    name="username" 
                    id="username" 
                    value={formData.username} 
                    onChange={handleFormData} 
                    className="input" 
                    required 
                />

                <label htmlFor="role" className="label">Role:</label>
                <select 
                    name="role" 
                    id="role" 
                    value={formData.role} 
                    onChange={handleFormData} 
                    className="select" 
                    required
                >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>

                <label htmlFor="password" className="label">Password:</label>
                <input 
                    type="password" 
                    name='password' 
                    id='password' 
                    value={formData.password} 
                    onChange={handleFormData} 
                    className="input" 
                    required 
                />

                <button 
                    type="submit" 
                    className="register-button" 
                    disabled={loading}
                >
                    {loading ? "Registering..." : "Register Now"}
                </button>
                <button 
                    type="button" 
                    onClick={() => navigate("/login")} 
                    className="button login-button"
                >
                    Login Page
                </button>
            </form>

            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
        </div>
    );
}

export default Register;
