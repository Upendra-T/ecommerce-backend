const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Schema } = mongoose;

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType:{ type: String, default: "customer" },
  isVerified: { type: Boolean, default: false },
  address:{ type: String, required:true },
  verificationToken: String,
  resetPasswordToken: String,
});


userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
  next();
});

exports.User=mongoose.model('User',userSchema);
