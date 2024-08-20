const express = require("express");
const taskRouter = express.Router();
const auth = require("../middleware/auth.middleware");
const taskModel = require("../models/task.model");
const roleAuth = require("../middleware/roleAuth.middleware");



taskRouter.post("/create", roleAuth(["user", "admin"]), async (req, res) => {
  try {
    const { title, description, dueDate, status, createdBy, assignedTo } =
      req.body;
    const userId = req.user.id;
    const task = new taskModel({
      title,
      description,
      dueDate,
      status,
      createdBy: userId,
      assignedTo: userId,
    });
    await task.save();
    return res.status(201).json({ message: "Task created successfully", task });
  } catch (error) {
    return res.status(500).json({ message: "Error creating task", error });
  }
});


taskRouter.patch("/update/:id", roleAuth(["user", "admin"]), async (req, res) => {
  try {
      const userId = req.user.id;
      const role = req.user.role;
      const taskId = req.params.id;
      const task = await taskModel.findOne({ _id: taskId });
      if (role === "user" && task.createdBy.toString() !== userId) {
          return res.status(403).json({ message: "You are not authorized to update this task" });
      }
      const payload = req.body;
      const updatedTask = await taskModel.findByIdAndUpdate(taskId, payload, { new: true });
      return res.status(200).send({ message: "Task Updated Successfully", updatedTask });
  } catch (error) {
      return res.status(500).json({ message: "Error updating task", error });
  }
});


taskRouter.delete("/delete/:id", roleAuth(["user", "admin"]), async (req, res) => {
  try {
      const userId = req.user.id;
      const role = req.user.role;
      const taskId = req.params.id;
      const task = await taskModel.findOne({ _id: taskId });
      if (role === "user" && task.createdBy.toString() !== userId) {
          return res.status(403).json({ message: "You are not authorized to delete this task" });
      }
      await taskModel.findByIdAndDelete(taskId);
      return res.status(200).send({ message: "Task Deleted Successfully" });
  } catch (error) {
      return res.status(500).json({ message: "Error deleting task", error });
  }
});




taskRouter.get("/tasks", roleAuth(["admin", "user"]), async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    let queryBase = {};

    if (req.user.role === "user") {
      queryBase.createdBy = req.user.id; 
    }

    const tasks = await taskModel.find(queryBase).skip(skip).limit(limit);

    const totalTasks = await taskModel.countDocuments(queryBase);
    const totalPages = Math.ceil(totalTasks / limit);

    return res.status(200).json({
      totalTasks,
      totalPages,
      currentPage: page,
      tasks: tasks.map(task => ({
        _id: task._id,
        title: task.title,
        description: task.description,
        status: task.status,
        dueDate: task.dueDate,
        createdBy: task.createdBy,
        assignedTo: task.assignedTo,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
        __v: task.__v
      }))
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching tasks", error: error.message });
  }
});



module.exports = taskRouter;
