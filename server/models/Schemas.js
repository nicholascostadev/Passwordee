const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const websiteSchema = new Schema({
	url: { type: String, required: true },
	name: { type: String, required: true },
	websiteEmail: { type: String, required: true },
	password: { type: String, required: true },
});

const userSchema = new Schema({
	username: { type: String },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	fullName: { type: String },
	entryDate: { type: Date, default: Date.now },
	websites: { type: Array, ref: 'websites' },
});

const Users = mongoose.model('users', userSchema);
const Websites = mongoose.model('websites', websiteSchema);

const mySchemas = { Users: Users };

module.exports = mySchemas;
