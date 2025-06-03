const express = require('express');
const router = express.Router();
const depositController = require('../controllers/depositController');
const multer = require('multer');
const path = require('path');
const { authMiddleware } = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});


const upload = multer({ storage });

router.post('/', authMiddleware, upload.single('file'), depositController.createDeposit);
router.get('/', authMiddleware, depositController.getAllDeposits);
router.get('/user/:userId', authMiddleware, depositController.getDepositsByUserId);
router.get('/pending/:userId', authMiddleware, depositController.getPendingDepositsByUserId);
router.get('/latest/:userId', authMiddleware, depositController.getDepositByUserId);
router.get('/:id', authMiddleware, depositController.getDepositById);
router.get('/total/:userId', authMiddleware, depositController.getTotalDepositAmountByUserId);
router.get('/total/pending/deposits', authMiddleware, depositController.getTotalPendingDeposits);
router.get('/total/approved/deposits', authMiddleware, depositController.getTotalApprovedDeposits);
router.put('/:id', authMiddleware, depositController.updateDeposit);
module.exports = router;
