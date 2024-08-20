import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import '../style/TaskList.css'; // Import the CSS file
import { useNavigate } from 'react-router-dom';

const TaskList = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [updateId, setUpdateId] = useState(null);
    const [updateText, setUpdateText] = useState({ title: '', description: '' });
    const [columns, setColumns] = useState({
        todo: {
            name: 'To-Do',
            items: [],
        },
        inProgress: {
            name: 'In-Progress',
            items: [],
        },
        done: {
            name: 'Done',
            items: [],
        },
    });

    useEffect(() => {
        const fetchTasks = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`https://mern-kanban-app.onrender.com/tasks?page=${currentPage}&limit=9`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(`Login Again! status: ${response.statusText}`);
                }

                const formattedTasks = {
                    todo: data.tasks.filter(task => task.status === 'to-do'),
                    inProgress: data.tasks.filter(task => task.status === 'in-progress'),
                    done: data.tasks.filter(task => task.status === 'done'),
                };

                setColumns({
                    todo: { name: 'To-Do', items: formattedTasks.todo },
                    inProgress: { name: 'In-Progress', items: formattedTasks.inProgress },
                    done: { name: 'Done', items: formattedTasks.done },
                });

                setTotalPages(data.totalPages);

            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, [token, currentPage]);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    };

    const handleOnDragEnd = async (result) => {
        const { source, destination } = result;

        if (!destination) return;

        const startColumn = columns[source.droppableId];
        const endColumn = columns[destination.droppableId];
        const movedItem = startColumn.items[source.index];

        if (startColumn === endColumn) {
            // Reorder within the same column
            const updatedItems = Array.from(startColumn.items);
            updatedItems.splice(source.index, 1);
            updatedItems.splice(destination.index, 0, movedItem);

            const updatedColumn = {
                ...startColumn,
                items: updatedItems,
            };

            setColumns({
                ...columns,
                [source.droppableId]: updatedColumn,
            });
        } else {
            // Move between columns
            const startItems = Array.from(startColumn.items);
            startItems.splice(source.index, 1);

            const endItems = Array.from(endColumn.items);
            endItems.splice(destination.index, 0, movedItem);

            setColumns({
                ...columns,
                [source.droppableId]: {
                    ...startColumn,
                    items: startItems,
                },
                [destination.droppableId]: {
                    ...endColumn,
                    items: endItems,
                },
            });

            try {
                const response = await fetch(`https://mern-kanban-app.onrender.com/task/update/${movedItem._id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({ status: destination.droppableId }),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

            } catch (error) {
                console.error('Error updating task status:', error);
            }
        }
    };

    if (loading) return <p>Loading tasks...</p>;
    if (error) return <p className="error-message">{error}</p>;

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`https://mern-kanban-app.onrender.com/task/delete/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            alert("Task deleted successfully");

            // Remove the deleted task from the UI
            setColumns((prevColumns) => {
                const updatedColumns = { ...prevColumns };
                Object.keys(updatedColumns).forEach((key) => {
                    updatedColumns[key].items = updatedColumns[key].items.filter((item) => item._id !== id);
                });
                return updatedColumns;
            });

        } catch (error) {
            alert('Error deleting task:', error);
        }
    };

    const handleUpdateSave = async () => {
        try {
            const response = await fetch(`https://mern-kanban-app.onrender.com/task/update/${updateId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(updateText)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Update the task in the UI
            setColumns((prevColumns) => {
                const updatedColumns = { ...prevColumns };
                Object.keys(updatedColumns).forEach((key) => {
                    updatedColumns[key].items = updatedColumns[key].items.map((item) =>
                        item._id === updateId ? { ...item, ...updateText } : item
                    );
                });
                return updatedColumns;
            });

            alert('Task updated successfully');
            setUpdateId(null);
            setUpdateText({ title: '', description: '' });

        } catch (error) {
            alert('Error updating task:', error);
        }
    };

    const handleUpdateCancel = () => {
        setUpdateId(null);
        setUpdateText({ title: '', description: '' });
    };

    return (
        <div className="task-list-container">
            <h1 style={{ textAlign: "center" }}>KANBAN BOARD</h1>

            <DragDropContext onDragEnd={handleOnDragEnd}>
                <div className="task-container">
                    {Object.entries(columns).map(([columnId, column]) => (
                        <Droppable key={columnId} droppableId={columnId}>
                            {(provided) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className={`column ${columnId}`}
                                >
                                    <h3 className={`column-heading ${columnId}`}>{column.name}</h3>
                                    {column.items.map((item, index) => (
                                        <Draggable key={item._id} draggableId={item._id} index={index}>
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className="task"
                                                >
                                                    {updateId === item._id ? (
                                                        <>
                                                            <input
                                                                type="text"
                                                                value={updateText.title}
                                                                onChange={(e) => setUpdateText({ ...updateText, title: e.target.value })}
                                                                className="task-title-input"
                                                            />
                                                            <textarea
                                                                value={updateText.description}
                                                                onChange={(e) => setUpdateText({ ...updateText, description: e.target.value })}
                                                                className="task-description-input"
                                                            />
                                                            <div className="task-footer">
                                                                <button className="save-button" onClick={handleUpdateSave}>SAVE</button>
                                                                <button className="cancel-button" onClick={handleUpdateCancel}>Cancel</button>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div className="task-title">{item.title}</div>
                                                            <p className="task-description">{item.description}</p>
                                                            <p>Due Date: {item.dueDate}</p>
                                                            <div className="task-footer">
                                                                <button className="delete-button" onClick={() => handleDelete(item._id)}>DELETE</button>
                                                                <button className="update-button" onClick={() => {
                                                                    setUpdateId(item._id);
                                                                    setUpdateText({ title: item.title, description: item.description });
                                                                }}>UPDATE</button>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    ))}
                </div>
            </DragDropContext>

            <div className="pagination-controls">
                <button onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</button>

                <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
            </div>

            <div className="pagination-controls2">
                <button className='create-button' onClick={() => { navigate("/create") }} >Create Task</button>

                <button className='logout-button' onClick={() => {
                    localStorage.removeItem("token")
                    navigate("/login")
                }} >Log Out</button>
            </div>
        </div>
    );
};

export default TaskList;
