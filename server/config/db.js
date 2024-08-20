const mongoose = require("mongoose")

const connection = mongoose.connect(process.env.DATABASE).then(()=>console.log("Database is connected"))
.catch(error=>console.log(`Error while connecting database ${error}`))

module.exports = connection 