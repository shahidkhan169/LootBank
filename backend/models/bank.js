const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  userid: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true, unique: true },
  dob: { type: Date, required: true },
  age: { type: Number, required: true },
  address: { type: String, required: false },
  nationality: { type: String, required: true },
  state: { type: String, required: true },
  district: { type: String, required: true },
  mpin: { type: String, required: true },
  accountNo: { type: String, required: true, unique: true },
  accountBalance: { type: Number, required: true, default: 0 },
  password: { type: String, required: true }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;


