const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
  const { name, userName, email, password, confirmPassword, bio } = req.body;
  if (password !== confirmPassword) return res.status(400).json({ error: 'Passwords do not match' });
  const user = new User({ name, userName, email, password, bio });
  await user.save();
  res.status(201).json({ message: 'User created' });
};

exports.login = async (req, res) => { 
  const { userName, password } = req.body;
  const user = await User.findOne({ userName });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET); 
  res.status(200).json({ message: 'Login successful', token, user });   
};
