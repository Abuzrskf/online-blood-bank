const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 1. Middlewares
app.use(express.json());
app.use(cors()); // This allows Vercel to access this API

// 2. Database Connection
const uri = process.env.MONGO_URI;

if (!uri) {
    console.log("❌ ERROR: MONGO_URI is missing from Environment Variables!");
} else {
    mongoose.connect(uri)
        .then(() => console.log("✅ Successfully connected to MongoDB Cloud!"))
        .catch((err) => console.log("❌ Cloud connection error:", err.message));
}

// 3. Data Schema & Model
const donorSchema = new mongoose.Schema({
    name: String,
    bloodGroup: String,
    phone: String,
    city: String,
    date: { type: Date, default: Date.now }
});

const Donor = mongoose.model('Donor', donorSchema);

// 4. Routes
// Test Route
app.get('/', (req, res) => {
    res.send("Cloud Blood Bank Server is Active!");
});

// Registration Route
app.post('/api/register', async (req, res) => {
    try {
        const newDonor = new Donor(req.body);
        await newDonor.save();
        res.status(201).json({ message: "Donor Registered Successfully!" });
    } catch (error) {
        res.status(400).json({ error: "Registration Failed: " + error.message });
    }
});

// 5. Start Server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});