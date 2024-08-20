import React, { useState } from 'react';
import '../style/CreateTask.css'; 
import { useNavigate } from 'react-router-dom';

const CreateTask = () => {
    const token = localStorage.getItem("token");
    const navigate = useNavigate()
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        dueDate: "",
        status: "todo"
    });

    const handleFormData = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => {
            return { ...prevData, [name]: value };
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await fetch("https://kanban-board-full-stack.onrender.com/task/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error(await response.text()); 
            }


            setSuccess("Task created successfully");
            setFormData({
                title: "",
                description: "",
                dueDate: "",
                status: "todo"
            });

        } catch (error) {
            setError(error.message || "An error occurred while creating the task.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-container">
            <h1 style={{color : "WHITE"}}>ADD TASK</h1>
            <form className="create-form" onSubmit={handleSubmit}>
                <label htmlFor="title" className="create-label">Title:</label>
                <input
                    type="text"
                    name="title"
                    id="title"
                    className="create-input"
                    value={formData.title}
                    onChange={handleFormData}
                    required
                />

                <label htmlFor="description" className="create-label">Description:</label>
                <input
                    type="text"
                    name="description"
                    id="description"
                    className="create-input"
                    value={formData.description}
                    onChange={handleFormData}
                    required
                />

                <label htmlFor="dueDate" className="create-label">Due Date:</label>
                <input
                    type="date"
                    name="dueDate"
                    id="dueDate"
                    className="create-input"
                    value={formData.dueDate}
                    onChange={handleFormData}
                    required
                />

                <label htmlFor="status" className="create-label">Status:</label>
                <select
                    name="status"
                    id="status"
                    className="create-select"
                    value={formData.status}
                    onChange={handleFormData}
                >
                    <option value="todo">TO-DO</option>
                    <option value="inProgress">IN PROGRESS</option>
                    <option value="done">DONE</option>
                </select>

                <button type="submit" className="create-button" disabled={loading}>
                    {loading ? "Creating Task..." : "Create Task"}
                </button>

                <button onClick={()=>navigate("/tasks")}  className="create-button">
                    All Tasks
                </button>

                {error && <p className="create-error-message">{error}</p>}
                {success && <p className="create-success-message">{success}</p>}
            </form>
        </div>
    );
};

export default CreateTask;
