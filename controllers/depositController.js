const Deposit = require("../models/Deposit");
const mongoose = require("mongoose");

exports.createDeposit = async (req, res) => {
  try {
    const { amount, gateway, userId } = req.body;
    const fileUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const deposit = new Deposit({
      trxId:  Math.random().toString(36).substring(2, 10).toUpperCase(),
      amount,
      charge: 0,
      rate: 1,
      totalPaid: amount,
      gateway,
      fileUrl,
      userId,
    });

    await deposit.save();
    res.status(201).json(deposit);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//get deposit detail by userId and last one that just created
exports.getDepositByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid userId format" });
    }

    const deposit = await Deposit.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    }).sort({ createdAt: -1 });

    if (!deposit) return res.status(404).json({ error: "Deposit not found" });

    res.json(deposit);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//get all deposits by userId

exports.getDepositsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid userId format" });
    }

    const deposits = await Deposit.find({
      userId: new mongoose.Types.ObjectId(userId),
    }).sort({ createdAt: -1 });
    res.json(deposits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllDeposits = async (req, res) => {
  try {
    const deposits = await Deposit.find().populate('userId', 'name').sort({ createdAt: -1 });
    
    res.json(deposits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update deposit status by admin
exports.updateDepositStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid deposit ID format" });
    }

    const deposit = await Deposit.findByIdAndUpdate(id, { status });

    if (!deposit) return res.status(404).json({ error: "Deposit not found" });

    res.json(deposit);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete deposit by admin
exports.deleteDeposit = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid deposit ID format" });
    }

    const deposit = await Deposit.findByIdAndDelete(id);

    if (!deposit) return res.status(404).json({ error: "Deposit not found" });

    res.json({ message: "Deposit deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//get pending deposits by userId
exports.getPendingDepositsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid userId format" });
    }

    const deposits = await Deposit.find({
      userId: new mongoose.Types.ObjectId(userId),
      status: "Pending",
    }).sort({ createdAt: -1 });

    if (deposits.length === 0) {
      return res.status(404).json({ error: "No pending deposits found" });
    }

    res.json(deposits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//get deposit by id
exports.getDepositById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid deposit ID format" });
    }

    const deposit = await Deposit.findById(id).populate('userId', 'name');

    if (!deposit) return res.status(404).json({ error: "Deposit not found" });

    res.json(deposit);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//get total deposit amount that status approved by userId
exports.getTotalDepositAmountByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid userId format" });
    }

    const totalDeposit = await Deposit.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          status: "Approved",
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);

    if (totalDeposit.length === 0) {
      return res.status(404).json({ error: "No approved deposits found" });
    }

    res.json(totalDeposit[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//get total deposit amount that status approved
exports.getTotalApprovedDeposits = async (req, res) => {
  try {
    const totalDeposit = await Deposit.aggregate([
      {
        $match: {
          status: "Approved",
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);

    if (totalDeposit.length === 0) {
      return res.status(404).json({ error: "No approved deposits found" });
    }

    res.json(totalDeposit[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//get total pending deposits by admin
exports.getTotalPendingDeposits = async (req, res) => {
  try {
    const deposits = await Deposit.find({     
      status: "Pending",
    }).populate('userId', 'name').sort({ createdAt: -1 });

    if (deposits.length === 0) {
      return res.status(404).json({ error: "No pending deposits found" });
    }

    res.json(deposits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//update deposit status
exports.updateDeposit = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid deposit ID format" });
    }

    const deposit = await Deposit.findByIdAndUpdate(
      id,
      { status },      
    );

    if (!deposit) return res.status(404).json({ error: "Deposit not found" });

    res.json(deposit);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};