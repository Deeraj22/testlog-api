const userModel = require('../models/user')
const nodeMailer = require('nodemailer')

module.exports.signup = (req, res) => {
    // the data that gets in the req is passed to model and saved inside models user


    userModel.findOne({ email: req.body.email }).then((resultEmail) => {
        if (resultEmail) {
            res.send({ code: 404, message: 'user Already exist' })
        }
        else {
            const newUser = new userModel({ //Instance of the model
                email: req.body.email,
                password: req.body.password
            });
            newUser.save().then(() => {                      //Save the instanse
                res.send({ code: 200, message: 'Signup success' })
            }).catch((err) => {
                res.send({ code: 500, message: 'signup error' })
            })
        }

    }).catch((err1) => {
        res.send({ code: 500, message: 'signup error' })
    })
}



module.exports.signin = (req, res) => {
    // the data that gets in the req is passed to model and saved inside models user

    //Email and password match

    userModel.findOne({ email: req.body.email })
        .then(result => {

            //match password

            if (result.password !== req.body.password) {
                res.send({ code: 404, message: 'Password Wrong' })
            } else {
                res.send({
                    code: 200,
                    message: 'User found',
                    token: 'jdjdj'
                })
            }
        })
        .catch(err => {
            res.send({ code: 500, message: 'user not found' })
        })
}



module.exports.sendotp = async (req, res) => {
    const _otp = Math.floor(100000 + Math.random() * 900000)

    let user = await userModel.findOne({ email: req.body.email })

    if (!user) {
        res.send({ code: 500, message: 'User not found ' })
    } else {




        //send to user mail
        let transporter = await nodeMailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.USER,
                pass: process.env.PASS,
            }
        })

        let info = await transporter.sendMail({
            from: '"Hacker 😈" <dd5634809@gmail.com>', // sender address
            to: req.body.email, // list of receivers
            subject: "Rest Password", // Subject line
            text: String(_otp), // plain text body
            html: `<html>
        <head>
          <meta charset="utf-8">
          <title>NodeMailer Email Template</title>
          <style>
            .container {
              width: 100%;
              height: 100%;
              padding: 20px;
              background-color: #f4f4f4;
            }
            .email {
              width: 80%;
              margin: 0 auto;
              background-color: #fff;
              padding: 20px;
            }
            .email-header {
              background-color: #333;
              color: #fff;
              padding: 20px;
              text-align: center;
            }
            .email-body {
              padding: 20px;
            }
            .email-footer {
              background-color: #333;
              color: #fff;
              padding: 20px;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="email">
              <div class="email-header">
                <h1>One Time 
                Password</h1>
              </div>
              <div class="email-body">
                <p>${String(_otp)}</p>
              </div>
              <div class="email-footer">
                <p>St Aloysius college mangalore</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,

        });

        if (info.messageId) {

            //update  db

            userModel.updateOne({ email: req.body.email }, { otp: _otp }).then(result => {

                res.send({ code: 200, message: 'otp sent' })



            }).catch(err => {
                res.send({ code: 500, message: 'Service error' })
            })


        } else {
            res.send({ code: 500, message: 'Service error' })
        }

    }
}



module.exports.submitotp = (req, res) => {

    userModel.findOne({ otp: req.body.otp }).then(result => {

        //update the password

        userModel.updateOne({ email: result.email }, { password: req.body.password }).then(result => {

            res.send({ code: 200, message: 'Password updated' })



        }).catch(err => {
            res.send({ code: 500, message: 'Service error' })
        })



    }).catch(err => {
        res.send({ code: 404, message: 'otp is wrong' })
    })

}