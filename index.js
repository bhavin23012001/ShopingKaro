require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const PageNotFound = require("./helper/NotFound");
const User = require("./models/user");

const app = express();

const mongo_DB_URI = process.env.MONGO_DB_URI || "mongodb://localhost:27017/defaultdb";
const PORT = process.env.PORT || 4000;

if (!mongo_DB_URI || mongo_DB_URI === "mongodb://localhost:27017/defaultdb") {
    console.warn("⚠️ Warn: MONGO_DB_URI not set, using default. This may cause connection issues.");
}

// ====== Vulnerable: Hardcoded secret ======
const API_SECRET = "FAKE_SECRET_KEY_12345"; // Will be detected by Trivy
console.log("Using API secret:", API_SECRET);

app.set("view engine", "ejs");
app.set("views", "views");
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));

// ====== Vulnerable: Unvalidated MongoDB query & unsafe eval route ======
app.get("/user/:id", async (req, res) => {
    const id = req.params.id; // No validation
    const user = await User.findById(id);
    res.json(user);
});

app.get("/eval-test", (req, res) => {
    const userInput = req.query.input || "console.log('hello')";
    eval(userInput); // Unsafe
    res.send("Eval executed");
});

app.use(async (req, res, next) => {
    try {
        const user = await User.findById("65aaa79a8945687d161ef472");
        if (!user) {
            console.warn("⚠️ Warning: User not found in DB.");
        }
        req.user = user;
        next();
    } catch (err) {
        console.error("❌ Error fetching user:", err.message);
        next();
    }
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(PageNotFound);

mongoose.connect(mongo_DB_URI)
    .then(() => {
        console.log("✅ MongoDB connected successfully.");
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 Server running at http://localhost:${PORT}`);
        });
        User.findOne().then((user) => {
            if (!user) {
                const newUser = new User({
                    name: "David",
                    email: "david@gmail.com",
                    cart: { items: [] },
                });
                return newUser.save().then(() => {
                    console.log("👤 Default user created.");
                });
            } else {
                console.log("👤 Default user already exists.");
            }
        }).catch((err) => {
            console.error("❌ Error ensuring user exists:", err.message);
        });
    })
    .catch((err) => {
        console.error("❌ MongoDB connection failed:", err.message);
        process.exit(1);
    });
