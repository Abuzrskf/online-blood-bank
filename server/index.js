const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// 1. Load the .env file
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// 2. Connect to MongoDB Cloud
const uri = process.env.MONGO_URI;

mongoose.connect(uri)
    .then(() => console.log("✅ Successfully connected to MongoDB Cloud!"))
    .catch((err) => console.log("❌ Cloud connection error:", err));

// 3. Test route
app.get('/', (req, res) => {
    res.send("Cloud Blood Bank Server is Active!");
});

const Donor = require('./models/Donor');

// API to Register a Donor
app.post('/api/register', async (req, res) => {
    try {
        const newDonor = new Donor(req.body);
        await newDonor.save();
        res.status(201).json({ message: "Donor saved to Cloud successfully!" });
    } catch (err) {
        res.status(500).json({ error: "Failed to save donor" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});