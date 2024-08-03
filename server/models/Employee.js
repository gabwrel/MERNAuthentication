const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
    name: String,
    email: String,
    age: Number,
    profileImage: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true }
});

const EmployeeModel = mongoose.model('employees', EmployeeSchema);
module.exports = EmployeeModel;
