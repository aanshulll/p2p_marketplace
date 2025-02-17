const express = require("express");
const cors = require("cors");
const User = require("./models/user.model");
const AllProduct = require("./models/products.model");
const upload = require("./utils/fileupload");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const connectDB = require("./db/index");
const bcrypt = require("bcrypt");
const cookie_parser = require("cookie-parser");
const userModel = require("./models/user.model");
const app = express();
app.set("view engine", "ejs");

// ✅ CORS Configuration
app.use(cors({ origin: "*", credentials: true }));

// ✅ Middleware for parsing request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));
app.use(cookie_parser());
// ✅ Routes
app.get("/", (req, res) => res.render("index"));
app.get("/register", (req, res) => res.render("register"));

// ✅ Register User

// ✅ Get Users
app.get("/get-users", (req, res) => {
  User.find()
    .then((users) => res.json(users))
    .catch((err) =>
      res.status(500).json({
        error: "Failed to fetch users",
        details: err.message,
      })
    );
});
app.post(
  "/register",
  body("email").trim().isEmail(),
  body("password").trim().isLength({ min: 8 }),
  body("name").trim().isLength({ min: 10 }),

  async (req, res) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
      return res.status(400).json({
        error: err.array(),
        message: "invalid data",
      });
    } else {
      console.log("Received Data:", req.body); // Debugging

      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({
          error: "All fields are required",
        });
      }
      const hashkey = await bcrypt.hash(password, 10);
      const newUser = new User({
        name,
        email,
        password: hashkey,
      });
      newUser
        .save()
        .then(() =>
          res.status(201).json({
            message: "User registered successfully",
          })
        )
        .catch((err) =>
          res.status(500).json({
            error: "Server error",
            details: err.message,
          })
        );
    }
  }
);
// ✅ Add Product
app.get("/add_product", (req, res) => res.render("product_listing"));

app.post("/add_product", upload.single("file"), async (req, res) => {
  console.log("Received Data:", req.body);
  console.log("Uploaded File:", req.file);

  const { name, description, price } = req.body;

  if (!name || !description || !price || !req.file) {
    return res.status(400).json({
      error: "All fields are required, including the file",
    });
  }

  try {
    const newProduct = new AllProduct({
      name,
      description,
      price,
      file: req.file.filename, // Store filename
    });

    await newProduct.save();
    res.status(201).json({
      message: "✅ Product added successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: "❌ Server error",
      details: err.message,
    });
  }
});
//4. getting all products as a object in console 
app.get("/products", (req, res) => {
    const products = AllProduct.find()
      .then((product) => res.json(product))
      .catch((err) =>
        res.status(500).json({
          error: "Failed to fetch users",
          details: err.message,
        })
      );
      
      
  });

// ✅ Start Server

app.get("/login", (req, res) => {
  res.render("login");
});
// login page
app.post(
  "/login",
  // validating the data
  body("email").trim().isEmail(),
  body("password").trim().isLength({ min: 8 }),

  async (req, res) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
      return res.status(400).json({
        error: err.array(),
        message: "invalid data",
      });
    } else {
      console.log("Received Data:", req.body); // Debugging

      const { email, password } = req.body;
      const user = await userModel.findOne({
        email: email,
      });
      if (!user) {
        return res.status(400).json({
          message: "Username and password is incorrect",
        });
      } else {
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(400).json({
            message: "Username and password is incorrect",
          });
        } else {
        //   const token = jwt.sign(
        //     {
        //       userid: user.id,
        //       email: user.email,
        //     },
        //     process.env.JWT_SECRET
        //   );
        //   res.cookie("token", token);
          res.render("index");
        }
      }
    }
  }
);
module.exports = app;
