const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
	username: { type: String },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	fullName: { type: String },
	entryDate: { type: Date, default: Date.now },
});

const Users = mongoose.model('users', userSchema);
const mySchemas = { Users: Users };

module.exports = mySchemas;
