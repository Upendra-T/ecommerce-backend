
const nodemailer = require("nodemailer");
const model= require("../model/User");
const User=model.User;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const CustomerAddress = require('../model/customerAddress');



const secretKey = "f811b7889e175938b2906e3d68cc0363"; 
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: '#add your email here',
      pass: '#add your application password here',
    },
  });

  exports.createUser = async (req, res) => {
    try {
      const { email, password, confirmPassword, userType, address } = req.body;
      if (password !== confirmPassword) {
        return res.status(400).json({ error: 'Passwords do not match' });
      }
  
      const existingUser = await User.findOne({ email });
  
      if (existingUser) {
        return res.status(400).json({ error: 'Email already registered' });
      }
  
      const user = new User({ email, password, userType, address });
      user.verificationToken = jwt.sign({ email: user.email }, secretKey, { expiresIn: '1d' });
      const savedUser = await user.save();
  
      const newAddress = new CustomerAddress({
        uid: savedUser._id,
        address,
      });
      const savedAddress = await newAddress.save();
  
      res.json({ user: { email: savedUser.email }, address: savedAddress, message: 'User registered with address' });
    } catch (error) {
      console.error('User reg error:', error);
      res.status(400).json({ error: error.message });
    }
  };
exports.getUser = async(req, res) => {
  const users=await User.findOne({"email":req.params.email});
  res.json(users);
};

exports.verifyUser = async(req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        const uid=user._id;
        const usertype=user.userType;
        if (!user || !await bcrypt.compare(password, user.password)) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }
    
        const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' });
        res.json({ token,uid,usertype });
      } 
      catch (error) {
        console.error('User verify error:', error);
        res.status(400).json({ error: error.message });
      }
};
exports.forgotMailUser = async(req, res) => {
    try {
        const { email } = req.body;
    
        const user = await User.findOne({ email });
    
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }

        const resetToken = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' });
        user.resetToken = resetToken;
        await user.save();
        const resetLink = `http://localhost:3000/reset-password/${user._id}/${resetToken}`;
        const mailOptions = {
          to: user.email,
          subject: 'Reset your password',
          text: `Click on the following link to reset your password: ${resetLink}`,
        };
    
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error('Error sending reset password email:', error);
            return res.status(500).json({ error: 'Error sending reset password email' });
          }
    
          console.log('Reset password email sent:', info.response);
          res.json({ message: 'Reset password email sent' });
        });
      } 
      catch (error) {
        console.error('Forgot password error:', error);
        res.status(400).json({ error: error.message });
      }
};
exports.updateUserPassword = async (req, res) => {
  console.log("rpwd"+req.body);

  const { token } = req.body;
  const { password } = req.body;
  console.log("password in reset"+password)
  try {
    const decoded = jwt.verify(token, secretKey);
    const user = await User.findById(decoded.userId);
    console.log("password in reset usermail"+user.email);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    user.password = password;
    console.log("passwordencrypt in reset"+ user.password)
    await user.save();
    res.json({ message: 'Password successfully reset' });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(400).json({ error: 'Invalid or expired token' });
  }
};
exports.deleteUser = async(req, res) => {
  console.log(req.params.id);
  const users=await user.deleteOne({"email":req.params.id});
  res.json(users);
};
