require("dotenv").config();
const express = require("express");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const PageNotFound = require("./helper/NotFound");
const bodyParser = require("body-parser");
const path = require("path");
const User = require("./models/user");
const mongoose = require("mongoose");

const mongo_DB_URI = process.env.MONGO_DB_URI;
const PORT = process.env.PORT || 4000; // ✅ Environment-based port

const app = express();

// View engine setup
app.set("view engine", "ejs");
app.set("views", "views");

// Static files and body parsing
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));

// Middleware to attach a default user
app.use((req, res, next) => {
  User.findById("65aaa79a8945687d161ef472")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

// Routes
app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(PageNotFound);

// Connect to MongoDB and start server
mongoose
  .connect(mongo_DB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log("✅ Database connected");
      console.log(`🚀 App is running at http://localhost:${PORT}`);
      
      User.findOne().then((user) => {
        if (!user) {
          const newUser = new User({
            name: "David",
            email: "david@gmail.com",
            cart: { items: [] },
          });
          newUser.save();
        } else {
          console.log("👤 User already exists");
        }
      });
    });
  })
  .catch((err) => {
    console.log("❌ MongoDB connection error:", err);
  });
