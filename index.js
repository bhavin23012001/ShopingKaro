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
const PORT = process.env.PORT || 4000; // Default to 4000 to match pipeline

if (!mongo_DB_URI) {
    console.error("❌ MONGO_DB_URI not set in environment!");
    process.exit(1); // Exit immediately if no DB URI
}

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
    User.findById("65aaa79a8945687d161ef472")
        .then((user) => {
            req.user = user;
            next();
        })
        .catch((err) => {
            console.error("❌ Error fetching user:", err);
            next(); // Don't hang request
        });
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(PageNotFound);

mongoose
    .connect(mongo_DB_URI)
    .then(() => {
        app.listen(PORT, '0.0.0.0', () => { // Ensures it binds on all interfaces
            console.log("✅ Database connected");
            console.log(`🚀 App is running at http://localhost:${PORT}`);
            // Ensure a user exists
            User.findOne()
                .then((user) => {
                    if (!user) {
                        const newUser = new User({
                            name: "David",
                            email: "david@gmail.com",
                            cart: { items: [] },
                        });
                        return newUser.save();
                    }
                    console.log("👤 User already exists");
                })
                .catch((err) => console.error("❌ Error ensuring user:", err));
        });
    })
    .catch((err) => {
        console.error("❌ MongoDB connection error:", err);
        process.exit(1); // Exit on connection failure
    });