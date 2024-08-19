const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const UserModel = require('./models/Users');
const EmployeeModel = require('./models/Employee');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors({
    origin: ["https://employee-list-project.vercel.app/"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage });

const SECRET_KEY = process.env.SECRET_KEY;  
const uri = process.env.MONGODB_URI;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("Could not connect to MongoDB", err));

app.use('/uploads', express.static(uploadDir));

app.get("/", (req, res) => {
    res.json("Welcome to the API!");
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserModel.findOne({ email });
        if (user) {
            const isMatch = await user.comparePassword(password);
            if (isMatch) {
                const payload = { _id: user._id, email, fname: user.fname, lname: user.lname };
                const accessToken = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
                res.json({ success: true, accessToken });
            } else {
                res.status(400).json({ success: false, message: "Incorrect password" });
            }
        } else {
            res.status(404).json({ success: false, message: "User not found" });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: "An error occurred", error: err.message });
    }
});

app.post('/register', async (req, res) => {
    try {
        const user = await UserModel.create(req.body);
        res.status(201).json({ success: true, user });
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

app.post('/create', authenticateToken, upload.single('profileImage'), async (req, res) => {
    const { name, email, age } = req.body;
    const userId = req.user._id;
    const profileImage = req.file ? req.file.filename : null;

    try {
        if (!name || !email || !age) throw new Error('Required fields are missing');
        const employee = await EmployeeModel.create({ name, email, age, profileImage, user: userId });
        res.status(201).json({ success: true, employee });
    } catch (err) {
        console.error('Error creating employee:', err.message);
        res.status(500).json({ success: false, message: "An error occurred", error: err.message });
    }
});

app.get('/home', authenticateToken, async (req, res) => {
    const userId = req.user._id;

    try {
        const employees = await EmployeeModel.find({ user: userId });
        res.status(200).json({ success: true, employees });
    } catch (err) {
        res.status(500).json({ success: false, message: "An error occurred", error: err.message });
    }
});

app.get('/getEmployee/:id', authenticateToken, async (req, res) => {
    const userId = req.user._id;
    const employeeId = req.params.id;

    try {
        const employee = await EmployeeModel.findOne({ _id: employeeId, user: userId });
        if (!employee) return res.status(404).json({ success: false, message: "Employee not found" });
        res.status(200).json({ success: true, employee });
    } catch (err) {
        res.status(500).json({ success: false, message: "An error occurred", error: err.message });
    }
});

app.put('/update/:id', authenticateToken, upload.single('profileImage'), async (req, res) => {
    const userId = req.user._id;
    const employeeId = req.params.id;
    const { name, email, age, removeImage } = req.body;
    let updates = { name, email, age };

    if (req.file) {
        updates.profileImage = req.file.filename;
    }

    try {
        const employee = await EmployeeModel.findOne({ _id: employeeId, user: userId });

        if (!employee) {
            return res.status(404).json({ success: false, message: "Employee not found" });
        }

        if (removeImage && employee.profileImage) {
            fs.unlink(path.join(uploadDir, employee.profileImage), (err) => {
                if (err) console.error(err);
            });
            updates.profileImage = null;
        }

        Object.assign(employee, updates);
        await employee.save();

        res.status(200).json({ success: true, employee });
    } catch (err) {
        res.status(500).json({ success: false, message: "An error occurred", error: err.message });
    }
});

app.delete('/home/:id', authenticateToken, async (req, res) => {
    const userId = req.user._id;
    const employeeId = req.params.id;

    try {
        const employee = await EmployeeModel.findOneAndDelete({ _id: employeeId, user: userId });

        if (!employee) {
            return res.status(404).json({ success: false, message: "Employee not found" });
        }

        if (employee.profileImage) {
            fs.unlink(path.join(uploadDir, employee.profileImage), (err) => {
                if (err) console.error(err);
            });
        }

        res.status(200).json({ success: true, message: "Employee deleted successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: "An error occurred", error: err.message });
    }
});

app.delete('/removeImage/:id', authenticateToken, async (req, res) => {
    const userId = req.user._id;
    const employeeId = req.params.id;

    try {
        const employee = await EmployeeModel.findOne({ _id: employeeId, user: userId });

        if (!employee) {
            return res.status(404).json({ success: false, message: "Employee not found" });
        }

        if (employee.profileImage) {
            const imagePath = path.join(uploadDir, employee.profileImage);
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ success: false, message: "Failed to remove image", error: err.message });
                }
            });
            employee.profileImage = null;
            await employee.save();
            return res.status(200).json({ success: true, message: "Profile image removed successfully" });
        } else {
            return res.status(400).json({ success: false, message: "No profile image to remove" });
        }
    } catch (err) {
        console.error('Error removing image:', err.message);
        res.status(500).json({ success: false, message: "An error occurred", error: err.message });
    }
});

app.listen(3001, () => {
    console.log("Server is running on port 3001");
});
