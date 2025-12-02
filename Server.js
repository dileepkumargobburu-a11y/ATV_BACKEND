const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// MongoDB (will auto-connect on Render)
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/atciti');

// Schema
const admissionSchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength: 50 },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  trade: { type: String, required: true },
  message: String,
  date: { type: Date, default: Date.now }
});

const Admission = mongoose.model('Admission', admissionSchema);

// Routes
app.get('/api/admissions', async (req, res) => {
  try {
    const admissions = await Admission.find().sort({ date: -1 }).limit(50);
    res.json(admissions);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/admissions', async (req, res) => {
  try {
    const admission = new Admission(req.body);
    await admission.save();
    res.json({ success: true, message: 'Application submitted!' });
  } catch (error) {
    res.status(400).json({ error: 'Invalid data' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));
