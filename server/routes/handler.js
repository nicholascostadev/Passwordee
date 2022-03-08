const express = require('express');
const router = express.Router();
const Schemas = require('../models/Schemas.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation } = require('../validation');

// For the hashing
const saltRounds = process.env.SALT_ROUNDS;

router.post('/register', async (req, res) => {
	// save user's req
	const user = {
		email: req.body.email,
		password: req.body.password,
	};

	const { error } = registerValidation(user);
	// If validation goes wrong, return an error
	if (error)
		return res.status(400).json({
			status: 'error',
			error: error.details[0].message,
		});

	try {
		//	Hash user's password
		bcrypt.genSalt(saltRounds, (err, salt) => {
			bcrypt.hash(user.password, salt, async (err, hash) => {
				const User = {
					email: user.email,
					password: hash,
				};
				const newUser = new Schemas.Users(User);
				// await to save a new user
				await newUser.save((error, newUserResults) => {
					if (!error) {
						// Check if everything went right
						res.send({
							status: 'ok',
						});
					} else {
						if (error.code === 11000) {
							res.send({
								status: 'error',
								error: 'Email already in use',
							});
						} else {
							res.send({
								status: 'error',
								error: error.message,
							});
						}
					}
				});
			});
		});
	} catch (err) {
		console.log(err);
	}
});

router.post('/login', async (req, res) => {
	const Users = Schemas.Users;
	// Save user's request
	const user = {
		email: req.body.email,
		password: req.body.password,
	};

	const { error } = loginValidation(user);
	// Check if there was any errors
	if (error)
		return res.status(400).res.json({
			status: 'error',
			error: error,
		});

	// Find the user and compare his input with his hashed password
	// if the user exists with the same password, save a token
	// for the user on localStorage() with his id, email and username
	// (if he has one username already)

	try {
		await Users.findOne({ email: user.email }).then(foundUser => {
			bcrypt.compare(user.password, foundUser.password, (error, result) => {
				if (result) {
					const token = jwt.sign(
						{
							id: foundUser._id,
							email: foundUser.email,
							username: foundUser.username,
						},
						process.env.JWT_SECRET
					);
					res.json({
						status: 'ok',
						token: token,
					});
				} else {
					console.log('Error during encryption');
				}
			});
		});
	} catch (err) {
		res.json({
			status: 'error',
			error: 'Wrong email or password',
		});
	}
});

router.post('/getWebsitesData', async (req, res) => {
	const Users = Schemas.Users;

	// The email received is from the token, since the user has to have one
	// the token is always checked if exists on the front-end
	const user = {
		email: req.body.email,
		id: req.body.id,
	};

	// Find the user with the correct email and _id(from the token)
	try {
		await Users.findOne({ email: user.email, _id: user.id }).then(foundUser => {
			// If found, send the array of websites the user has
			res.json({
				status: 'ok',
				websites: [foundUser.websites],
			});
		});
	} catch (err) {
		// Else, return an error
		res.json({
			status: 'error',
			error: 'No user found',
		});
	}
});

router.post('/saveNewWebsite', async (req, res) => {
	const Users = Schemas.Users;

	// If there is actually something being received, decode the token
	if (req.body) {
		const decodedToken = jwt.decode(req.body.token);
		try {
			// Find the user with the token and push the new Website
			// to his array of objects on DB
			await Users.findOneAndUpdate(
				{ email: decodedToken.email, _id: decodedToken.id },
				{ $push: { websites: req.body.newWebsite } }
			);

			// Send a response to let the user know his request was successful
			res.json({
				status: 'ok',
				data: 'Saved new website',
			});
		} catch (err) {
			// Catch if were any errors during saving
			res.json({
				status: 'error',
				error: 'This error:' + err.message,
			});
		}
	} else {
		res.json({
			status: 'error',
			error: "Couldn't save",
		});
	}
});

router.delete('/deleteWebsite', async (req, res) => {
	const Users = Schemas.Users;

	// Decode user's token
	const user = jwt.decode(req.body.token);

	// The logic is to remove the website that has the same email and name
	// because the user can't have two accounts on the same website with
	// the same email. e.g:
	// name: Amazon, email: test@gmail.com --> the user cant have another
	// Amazon account with the same email
	const _email = req.body.data.email;
	const _name = req.body.data.websiteName;

	// if there is actually something being sent from user...
	if (req.body) {
		try {
			// Find the website with the given info and pull from array
			await Users.findOneAndUpdate(
				{ email: user.email, _id: user.id },
				{ $pull: { websites: { email: _email, name: _name } } },
				{ safe: true, multi: true }
			);
			res.json({
				status: 'ok',
				data: 'Removed website',
			});
		} catch (err) {
			res.json({
				status: 'error',
				error: err,
			});
		}
	} else {
		res.json({
			status: 'error',
			error: 'Not enough data received',
		});
	}
});

router.post('/settingsChange', async (req, res) => {
	const Users = Schemas.Users;
	const user = jwt.decode(req.body.token);

	// Handle request for username changing
	if (req.body.data.newUsername) {
		console.log('received username');
		try {
			// The user is form the user's token
			await Users.findOneAndUpdate(
				{ email: user.email, _id: user.id },
				{
					username: req.body.data.newUsername,
				}
			).then(() => {
				res.json({
					status: 'ok',
					data: 'Successfully set new username',
				});
			});
		} catch (err) {
			if (err.code === 11000) {
				// Validate if username already exists
				res.json({
					status: 'error',
					error: 'Username already in use',
				});
			} else {
				res.json({
					status: 'error',
					error: err.message,
				});
			}
		}
	}

	// Handle request for fullName changing
	if (req.body.data.fullName) {
		console.log('received fullname');
		try {
			// User is also taken from his token
			await Users.findOneAndUpdate(
				{ email: user.email, _id: user.id },
				{
					fullName: req.body.data.fullName,
				}
			).then(() => {
				res.json({
					status: 'ok',
					data: "Successfully user's set fullName",
				});
			});
		} catch (err) {
			console.log(err.message);
			res.json({
				status: 'error',
				error: err.message,
			});
		}
	}
});

module.exports = router;
