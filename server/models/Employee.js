const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const EmployeeSchema = new mongoose.Schema({
    name: String,
    email: { type: String, required:true},
    password: { type: String, required:true}
})

EmployeeSchema.pre("save", async function(next){
    const user = this;
    if (!user.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
    next();
})

EmployeeSchema.methods.comparePassword = async function(password) {
    return bcrypt.compare(password, this.password);
}

const EmployeeModel = mongoose.model("employees", EmployeeSchema)
module.exports = EmployeeModel