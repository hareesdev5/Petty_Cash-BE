const userDataModel = require("../model/User");
const nodeMail = require("nodemailer");
const Auth = require('../common/Auth')

//create user

const userSignUp = async (req, res) => {
  try {
    let user = await userDataModel.findOne({ email: req.body.email });
    if (!user) {
      req.body.Password = await Auth.hashPassword(req.body.Password);
      await userDataModel.create(req.body);
      let token = await Auth.createToken({
        Name:req.body.Name,
        email: req.body.email,
      });
      let userData = await userDataModel.findOne({email: req.body.email},{_id:0,email:0,Password:0,status:0,createAt:0})
      res.status(201).send({
        message: "User Created Successfully",
        token,
        userData
      });
    } else {
      res.status(400).send({
        message: `User with ${req.body.email} Already Exists`,
      });
    }
  } catch (error) {
      console.log(error)
    res.status(500).send({
      message: "Fill all the form",
      error: error.message,
    });
  }
};

//login user

const login = async (req, res) => {
  try {
    let user = await userDataModel.findOne({ email: req.body.email });
    if (user) {
      let hashCompare = await Auth.hashCompare(
        req.body.Password,
        user.Password
      );
      if (hashCompare) {
        let token = await Auth.createToken({
          id:user._id,
          Name: user.Name,
          email: user.email,
        });
        let userData = await userDataModel.findOne({ email: req.body.email },{_id:0,email:0,Password:0,createAt:0});
        res.status(200).send({
          message: "Login Successfully",
          token,
          userData
        });
      } else {
        res.status(400).send({
          message: "Invalid Password",
        });
      }
    } else {
      res.status(400).send({
        message: `User with ${req.body.email} does not exists`,
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

//generate Forget password link

const forgotPassword = async (req, res) => {
  try {
    let user = await userDataModel.findOne({ email: req.body.email });
    // console.log(user)
    if (user) {
      let sender = nodeMail.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        },
      });
      let Btoken = `http://localhost:5173/reset/${user._id}`;
      let token = await Auth.createToken({
        id:user._id,
        Name: user.Name,
        email: user.email,
      });
      // console.log(process.env.FE_URL);
      let composeEmail = {
        from: process.env.EMAIL,
        to: user.email,
        subject: "Password Reset Link",
        html: `<p>Click <a href='${Btoken}'>here</a> to reset your password</p>`,
      };

      sender.sendMail(composeEmail, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          res.status(200).send({
            message: ("Mail send Successfully", Response.info),
            info,
          });
        }
      });
    } else {
      res.status(400).send({
        message: "Invalid Email",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

// Reset Password

const resetLink = async (req, res) => {
  try {
    let user = await userDataModel.findOne({ _id: req.params.id });
    let { Password } = req.body;
    let hashPassword = await Auth.hashPassword(Password);
    user.Password = Password ? hashPassword : user.Password;
    await user.save();

    res.status(200).send({
      message: "User Edited Successfully",
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

//get User

const getUser = async (req, res) => {
  try {
    let user = await userDataModel.find();
    res.status(200).send({
      message: "Data Fetched Successfully",
      count: user.length,
      user,
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

//delete User

const deleteUserById = async (req, res) => {
  let user = await userDataModel.findOne({ _id: req.params.id });
  try {
    if (user) {
      await userDataModel.deleteOne(user);
      res.status(200).send({
        message: "User Deleted Successfully",
      });
    } else {
      res.status(400).send({
        message: "Invalid User",
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  userSignUp,
  login,
  forgotPassword,
  getUser,
  deleteUserById,
  resetLink,
};
