const express = require("express");
const User = require("../src/models/user.model");

const router = express.Router();

// ✅ Render Registration Page
router.get("/register", (req, res) => {
  res.render("register");
});

// ✅ Handle User Registration
router.post("/register", async (req, res) => {
  console.log("Received Data:", req.body);

  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const newUser = new User({ name, email, password });
    await newUser.save();

    console.log("✅ User Registered:", newUser);
    res.status(201).json({ message: "✅ User registered successfully" });
  } catch (err) {
    console.error("❌ Error Registering User:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// ✅ Get All Users
router.get("/get-users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users", details: err.message });
  }
});

module.exports = router;
