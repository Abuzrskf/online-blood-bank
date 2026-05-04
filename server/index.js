const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const uri = process.env.MONGO_URI;

mongoose.connect(uri)
    .then(() => console.log("✅ Connected to MongoDB Cloud!"))
    .catch((err) => console.log("❌ Cloud connection error:", err.message));

// Schema (Standard structure)
const donorSchema = new mongoose.Schema({
    name: String,
    bloodGroup: String,
    phone: String,
    city: String,
    date: { type: Date, default: Date.now }
});

const Donor = mongoose.model('Donor', donorSchema);

// --- ROUTES ---

// 1. Registration Route
app.post('/api/register', async (req, res) => {
    try {
        const newDonor = new Donor(req.body);
        await newDonor.save();
        res.status(201).json({ message: "Donor Registered Successfully!" });
    } catch (error) {
        res.status(400).json({ error: "Registration Failed" });
    }
});

// 2. NEW: Inventory Aggregation Route (Counts documents per group)
app.get('/api/inventory', async (req, res) => {
    try {
        const stats = await Donor.aggregate([
            { $group: { _id: "$bloodGroup", count: { $sum: 1 } } }
        ]);
        res.json(stats);
    } catch (err) {
        res.status(500).json({ error: "Aggregation failed" });
    }
});

// 3. Test Route
app.get('/', (req, res) => {
    res.send("Cloud Blood Bank Server is Active!");
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});