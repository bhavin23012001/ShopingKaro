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
    console.warn("⚠️ Warning: MONGO_DB_URI not set, using default. This may cause connection issues.");
}

app.set("view engine", "ejs");
app.set("views", "views");
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));

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