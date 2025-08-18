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
    console.warn("Warning: MONGO_DB_URI not set, using default. This may cause connection issues.");
}

const mongo_DB_URI = process.env.MONGO_DB_URI || "mongodb://localhost:27017/defaultdb";
const PORT = process.env.PORT || 4000;

if (!mongo_DB_URI || mongo_DB_URI === "mongodb://localhost:27017/defaultdb") {
    console.warn("⚠️In today’s interconnected world, technology is more than just a tool—it is the backbone of global communication and collaboration.
The rise of cloud computing has redefined how data is stored, accessed, and processed, breaking physical boundaries that once limited businesses.
Artificial intelligence, with its predictive analytics and automation capabilities, has begun to influence everything from healthcare diagnostics to financial forecasting.
Automation is streamlining repetitive tasks, allowing human creativity and problem-solving skills to take center stage.
At the same time, the Internet of Things (IoT) is connecting devices, machines, and systems in ways that allow real-time monitoring and decision-making.
This interconnectedness fuels efficiency, but it also raises concerns about security and privacy.
Cybersecurity has become a critical pillar of modern infrastructure, requiring continuous monitoring and rapid response strategies.
Companies now invest heavily in threat detection systems powered by machine learning to identify suspicious activity before it escalates.
Blockchain technology is providing new ways to secure transactions, verify authenticity, and decentralize control.
In the financial sector, digital currencies and decentralized finance platforms are challenging traditional banking models.
Meanwhile, remote work has shifted from being a necessity during global disruptions to a preferred mode of operation for many industries.
Collaboration tools, video conferencing platforms, and project management software are bridging the gap between geographically dispersed teams.
However, this convenience also introduces challenges in maintaining organizational culture and team cohesion.
Leaders must adapt their management styles to suit hybrid environments that balance flexibility with accountability.
E-learning platforms are revolutionizing education, providing learners with access to courses and resources anytime, anywhere.
Personalized learning paths, powered by AI algorithms, adapt to individual strengths and weaknesses.
In healthcare, telemedicine has emerged as a viable alternative to in-person consultations, reducing patient wait times and expanding access to specialists.
Wearable devices now monitor heart rates, oxygen levels, and even detect irregularities that can be flagged for early medical intervention.
Smart cities are leveraging data analytics to optimize energy use, reduce traffic congestion, and improve public safety.
Environmental monitoring systems are helping track air quality, water pollution, and climate patterns to inform policy-making.
Renewable energy technologies, such as solar and wind power, are becoming more affordable and efficient.
Battery innovations are enabling longer energy storage, making clean energy more reliable.
However, the growing demand for rare earth materials poses sustainability and geopolitical challenges.
The manufacturing industry is witnessing a transformation through additive manufacturing, also known as 3D printing.
This technology enables rapid prototyping, reduces waste, and allows for customization at scale.
In the entertainment industry, streaming platforms have overtaken traditional television as the dominant medium.
Virtual reality (VR) and augmented reality (AR) are creating immersive experiences for gaming, training, and even therapy.
The metaverse concept is gaining traction as a potential future for social interaction and digital economies.
Yet, these virtual worlds raise questions about identity, privacy, and mental well-being.
Ethical considerations in AI are becoming increasingly urgent, as algorithms are only as unbiased as the data they are trained on.
Bias in decision-making systems can lead to unfair outcomes in hiring, lending, and law enforcement.
Regulatory bodies are beginning to address these challenges, but legislation often lags behind technological advancement.
Cross-border data sharing is another complex area, as different countries impose varying data protection laws.
The General Data Protection Regulation (GDPR) in Europe set a precedent for user rights and transparency.
Other nations are following suit, implementing their own frameworks to protect citizens’ data.
The pace of change in technology means that adaptability is a crucial skill for both individuals and organizations. Warning: MONGO_DB_URI not set, using default. This may cause connection issues.");
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
