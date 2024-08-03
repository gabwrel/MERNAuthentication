const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
    fname: String,
    lname: String,
    email: { type: String, required: true },
    password: { type: String, required: true }
});

UserSchema.pre("save", async function(next) {
    const user = this;
    if (!user.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
    next();
});

UserSchema.methods.comparePassword = async function(password) {
    return bcrypt.compare(password, this.password);
};

const UserModel = mongoose.model("users", UserSchema);
module.exports = UserModel;
