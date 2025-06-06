const User = require('../models/User');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

exports.createUserByAdmin = async (req, res) => {
  const { name, userName, email,  password, confirmPassword, phone } = req.body;
  if (password !== confirmPassword) return res.status(400).json({ error: 'Passwords do not match' });
  const user = new User({ name, userName, email, password, phone });
  await user.save();
  res.status(201).json({ message: 'User created by admin' });
};

exports.getAllUsers = async (req, res) => {
  // I want to get users except the admin user
  // const role = req.user?.role;
  // if (role !== 'admin') {
  //   return res.status(403).json({ error: 'Access denied' });
  // }
  // Fetch all users except the admin user
  const role = "admin";
  const users = await User.find({ role: { $ne: role } });
  res.json(users);
  // const users = await User.find();
  // res.json(users);
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  await User.findByIdAndDelete(id);
  res.json({ message: 'User deleted' });
};

exports.createAdminUser = async () => { 
  try {
    const existingAdmin = await User.findOne({
      userName: "superadmin",
    });
    if (!existingAdmin) {
      const adminUser = new User({
        fullName: "SuperAdmin",
        userName: "superadmin",
        email: "admin@admin.test",
        password: "123.123",
        role: "admin",
        phone: 'Admin user created by system'    
      });
      await adminUser.save();
      console.log("Default admin user created");
    } else {
      console.log("SuperAdmin already exist");
    }
  } catch (error) {
    console.error("Error creating default admin user:", error);
  }
}


exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
};

exports.updateProfile = async (req, res) => {
  const { name, email } = req.body;
  const user = await User.findByIdAndUpdate(req.user.id, { name, email }, { new: true });
  res.json(user);
};

exports.changePassword = async (req, res) => {
  const { password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  await User.findByIdAndUpdate(req.user.id, { password: hashed });
  res.json({ message: 'Password updated' });
};

exports.uploadAvatar = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const avatarPath = `/uploads/${req.file.filename}`;
  await User.findByIdAndUpdate(req.user.id, { avatar: avatarPath });
  res.json({ avatar: avatarPath });
};