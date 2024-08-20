const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: {
    type: String,
    required: true,
    default: "todo",
    enum: ["todo", "inProgress", "done"],
  },
  dueDate: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref : "User" , required : true  },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref : "User" , required : true  },

} , {timestamps : true });

const taskModel = mongoose.model("task", taskSchema);

module.exports = taskModel;
