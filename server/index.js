const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const EmployeeModel = require('./models/Employee');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/employee");

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await EmployeeModel.findOne({ email: email });
        if (user) {
            const isMatch = await user.comparePassword(password);
            if (isMatch) {
                res.json("Success");
            } else {
                res.json("The password is incorrect");
            }
        } else {
            res.json("Record not found");
        }
    } catch (err) {
        res.json(err);
    }
});

app.post('/register', (req, res) => {
    EmployeeModel.create(req.body)
    .then(employee => res.json(employee))
    .catch(err => res.json(err));
});

app.listen(3001, () => {
    console.log("server is running");
});
