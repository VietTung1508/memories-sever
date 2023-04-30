const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../model/user.js");
const otpGenerator = require("otp-generator");
const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");

const register = async (req, res, next) => {
  const user = req.body;
  const { password } = req.body;

  try {
    emailExist = await User.findOne({ email: user.email }).select("+password");

    if (emailExist)
      return res.status(500).json({ message: "Email is already exists" });

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const newUser = new User({
      ...user,
      followers: 0,
      password: hash,
    });
    await newUser.save();
    res.status(200).json(newUser);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email }).select("+password");
    if (!user)
      return res
        .status(401)
        .json({ message: "Email or Password is not valid" });

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch)
      return res
        .status(401)
        .json({ message: "Email or Password is not valid" });

    const accessToken = jwt.sign({ id: user._id }, process.env.TOKEN_PASSWORD, {
      expiresIn: "24h",
    });

    delete user.password;

    res.status(200).json({ user, accessToken });
  } catch (err) {
    res.status(500).json(err);
  }
};

const generateOTP = async (req, res) => {
  // Generate OTP
  req.app.locals.OTP = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });
  res.status(201).json({ msg: "Generate Success" });
};

const verifyOTP = async (req, res) => {
  const { code } = req.query;
  if (parseInt(req.app.locals.OTP) === parseInt(code)) {
    req.app.locals.OTP = null; // reset the OTP value
    req.app.locals.resetSession = true; // start session for resetPassword
    return res.status(201).json({ msg: "Verify Successfully!" });
  }

  res.status(400).json({ err: "Invalid OTP!" });
};

const sendGmail = async (req, res) => {
  const { userEmail } = req.body;

  if (!req.app.locals.OTP) {
    return res.json({ msg: "Need OTP" });
  }

  let config = {
    service: "gmail",
    auth: {
      user: "viettung150803@gmail.com",
      pass: process.env.APP_PASSWORD,
    },
  };

  let transporter = nodemailer.createTransport(config);

  let MailGenerator = new Mailgen({
    theme: "cerberus",
    product: {
      name: "Mailgen",
      link: "https://mailgen.js/",
    },
  });

  let response = {
    body: {
      name: `${userEmail}`,
      intro: `Your Password Recover OTP is ${req.app.locals.OTP}.`,
      outro:
        "Need help or have a question ? Just reply to this email and we'd love to help.",
    },
  };

  let mail = MailGenerator.generate(response);

  let message = {
    from: process.env.EMAIL,
    to: userEmail,
    subject: "Recover Password",
    html: mail,
  };

  try {
    await transporter.sendMail(message);
  } catch (e) {
    return res.status(500).json(e);
  }
  res.status(201).json({ msg: "You should get an email" });
};

const createResetSession = async (req, res) => {
  if (req.app.locals.resetSession) {
    req.app.locals.resetSession = false;
    return res.status(201).json({ msg: "Access Granted!" });
  }

  res.status(440).jsons({ msg: "Session expired" });
};

const resetPassword = async (req, res) => {
  const { email, password } = req.body;

  if (!req.app.locals.resetSession) {
    return res.status(440).json({ err: "Session expired" });
  }

  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    await User.findOneAndUpdate(
      { email: email },
      {
        password: hash,
      }
    );
    res.status(200).json("Reset Password Successfully");
  } catch (e) {
    res.status(500).json(e);
  }
};

module.exports = {
  register,
  login,
  sendGmail,
  generateOTP,
  verifyOTP,
  createResetSession,
  resetPassword,
};
