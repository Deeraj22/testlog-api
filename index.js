require('dotenv').config()
require('./config/allowedOrigin')
require('./config/corsOptions')
const express = require('express') // this is like import   
const bodyParser = require('body-parser')  //this is line import
const cors = require('cors')
const mongoose = require('mongoose')
const userController = require('./controller/user')


const port = process.env.PORT || 3000 //the port where backed works
const app = express()  // To create server


app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))

//parse application/json
app.use(bodyParser.json())


const uri = process.env.ATLAS_URI

mongoose.connect(uri, {
    useNewUrlParser: true, useUnifiedTopology: true
},).then(() => console.log('DB Connected'))
    .catch((err) => { console.error('Error'); });
//parse application/x-www-form-urlencoded


app.post('/signup', userController.signup)   //we will call this api using frontend

app.post('/signin', userController.signin)

app.post('/submitotp', userController.submitotp)

app.post('/sendotp', userController.sendotp)

app.listen(port, () => {
    console.log(`Backed running on the port ${port}`)
})
