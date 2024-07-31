const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require('jsonwebtoken');
const EmployeeModel = require('./models/Employee');

const app = express();
app.use(express.json());
app.use(cors());

const SECRET_KEY = 'voicemod'; // Store this securely in environment variables

mongoose.connect("mongodb://127.0.0.1:27017/employee", { useNewUrlParser: true, useUnifiedTopology: true });

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await EmployeeModel.findOne({ email: email });
        if (user) {
            const isMatch = await user.comparePassword(password);
            if (isMatch) {
                const payload = { email, fname: user.fname, lname: user.lname}; // Add user's name here
                const accessToken = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
                res.json({ success: true, accessToken });
            } else {
                res.status(400).json({ success: false, message: "The password is incorrect" });
            }
        } else {
            res.status(404).json({ success: false, message: "Record not found" });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: "An error occurred", error: err.message });
    }
});


app.post('/register', async (req, res) => {
    try {
        const employee = await EmployeeModel.create(req.body);
        res.status(201).json({ success: true, employee });
    } catch (err) {
        res.status(400).json({ success: false, message: "An error occurred", error: err.message });
    }
});

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

app.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: 'This is a protected route', user: req.user });
});

app.listen(3001, () => {
    console.log("Server is running on port 3001");
});