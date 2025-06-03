const express = require("express");
const router = express.Router();
const {
  createUserByAdmin,
  getAllUsers,
  deleteUser,
  getProfile,
  updateProfile,
  changePassword,
  uploadAvatar,
} = require("../controllers/userController");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middleware/authMiddleware");
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
  });
  const upload = multer({ storage });

router.post(
  "/admin/create",
  authMiddleware,
  adminMiddleware,
  createUserByAdmin
);
router.get("/", authMiddleware, adminMiddleware, getAllUsers);
router.delete("/:id", authMiddleware, adminMiddleware, deleteUser);
router.get('/me', authMiddleware, getProfile);
router.put('/me', authMiddleware, updateProfile);
router.post('/change-password', authMiddleware, changePassword);
router.post('/avatar', authMiddleware, upload.single('avatar'), uploadAvatar);

module.exports = router;
