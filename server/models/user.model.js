const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username : {type : String , required : true , unique : true},
    role : {type : String , required : true , enum:["user" , "admin"] , default : "user" },
    password : {type : String , required : true },
})

const userModel = mongoose.model("User"  , userSchema)

module.exports = userModel ; 