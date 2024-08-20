const express = require("express")
const dotenv = require("dotenv").config()
const connection = require("./config/db")
const userRouter = require("./routes/user.route")
const taskRouter = require("./routes/task.route")
const auth = require("./middleware/auth.middleware")
const cors = require("cors")

const app = express()
app.use(cors())

app.use(express.json())
app.use("/task" , auth ,  taskRouter )
app.use("/user" , userRouter)

const port = process.env.PORT

app.get("/" , (req,res)=>{
    res.send("welcome to the homepage of the kanban app")
})

app.listen(port , ()=>{
    console.log(`Server is running on port ${port}`)
})