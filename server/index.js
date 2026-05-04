const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// --- DATABASE CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected Successfully"))
    .catch(err => console.log("❌ Connection Error:", err));

// --- SCHEMAS & MODELS ---
// Donor Schema for Supply Tracking
const donorSchema = new mongoose.Schema({
    name: String, 
    bloodGroup: String, 
    phone: String, 
    city: String, 
    date: { type: Date, default: Date.now }
});

// Request Schema for Emergency Demand
const requestSchema = new mongoose.Schema({
    patientName: String, 
    hospital: String, 
    bloodGroup: String, 
    phone: String, 
    date: { type: Date, default: Date.now }
});

const Donor = mongoose.model('Donor', donorSchema);
const BloodRequest = mongoose.model('BloodRequest', requestSchema);

// --- ROUTES ---

// 1. Register a New Donor
app.post('/api/register', async (req, res) => {
    try {
        const donor = new Donor(req.body);
        await donor.save();
        res.status(201).json({ message: "Donor Registered Successfully!" });
    } catch (err) { res.status(400).json({ error: err.message }); }
});

// 2. Submit an Emergency Blood Request
app.post('/api/requests', async (req, res) => {
    try {
        const bloodReq = new BloodRequest(req.body);
        await bloodReq.save();
        res.status(201).json({ message: "Emergency Request Saved to Cloud!" });
    } catch (err) { res.status(400).json({ error: err.message }); }
});

// 3. Live Inventory Aggregation (Counts bags by blood group)
app.get('/api/inventory', async (req, res) => {
    try {
        const stats = await Donor.aggregate([
            { $group: { _id: "$bloodGroup", count: { $sum: 1 } } }
        ]);
        res.json(stats);
    } catch (err) { res.status(500).json({ error: "Aggregation failed" }); }
});

// Start Server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Server Running on Port ${PORT}`));

// 1. Admin Route: Get ALL Donors and ALL Requests
app.get('/api/admin/data', async (req, res) => {
    try {
        const donors = await Donor.find().sort({ date: -1 });
        const requests = await BloodRequest.find().sort({ date: -1 });
        res.json({ donors, requests });
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch admin data" });
    }
});

// 2. Delete Route: Remove a donor by ID
app.delete('/api/donors/:id', async (req, res) => {
    try {
        await Donor.findByIdAndDelete(req.params.id);
        res.json({ message: "Donor record deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Delete failed" });
    }
});