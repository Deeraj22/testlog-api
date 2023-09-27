//model or a table or document  require mongoose
const mongoose = require('mongoose');

//This is like table

//Schema structur
const userSchema = {
    email: String,
    password: String,
    otp: Number
}

module.exports = mongoose.model('User', userSchema);   //collection  'User' collection name

//which helps us to use this table anywhere in the project