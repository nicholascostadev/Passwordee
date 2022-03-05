const express = require('express');
const router = express.Router();
const Schemas = require('../models/Schemas.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const saltRounds = process.env.SALT_ROUNDS;

router.post('/register', async (req, res) => {
	const password = req.body.password;
	if (!password) {
		res.json({
			status: 'error',
			error: 'No empty passwords',
		});
	} else if (password.length < 6) {
		res.json({
			status: 'error',
			error: 'Password needs to have at least 6 characters',
		});
	} else if (password.trim().length < 6) {
		res.json({
			status: 'error',
			error: 'Password needs to have at least 6 characters, no spaces',
		});

		// TODO: See if this code works(checking if there are spaces inside the password)
	} else {
		try {
			bcrypt.genSalt(saltRounds, (err, salt) => {
				bcrypt.hash(password, salt, async (err, hash) => {
					const User = {
						email: req.body.email,
						password: hash,
					};
					const newUser = new Schemas.Users(User);

					await newUser.save((error, newUserResults) => {
						if (!error) {
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
								throw error;
							}
						}
					});
				});
			});
		} catch (err) {
			console.log(err);
		}
	}
});

router.post('/login', async (req, res) => {
	const Users = Schemas.Users;
	const _email = req.body.email;
	const _password = req.body.password;

	try {
		await Users.findOne({ email: _email }).then(foundUser => {
			bcrypt.compare(_password, foundUser.password, (error, result) => {
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
	const _email = req.body.email;

	try {
		await Users.findOne({ email: _email }).then(foundUser => {
			res.json({
				status: 'ok',
				websites: [foundUser.websites],
			});
		});
	} catch (err) {
		res.json({
			status: 'error',
			error: 'No user found',
		});
	}
});

router.post('/saveNewWebsite', async (req, res) => {
	const Users = Schemas.Users;
	if (req.body) {
		const decodedToken = jwt.decode(req.body.token);
		try {
			await Users.findOneAndUpdate(
				{ email: decodedToken.email, _id: decodedToken.id },
				{ $push: { websites: req.body.newWebsite } }
			);
			res.json({
				status: 'ok',
				data: 'Saved new website',
			});
		} catch (err) {
			res.json({
				status: 'error',
				error: 'This error:' + err,
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
	const user = jwt.decode(req.body.token);
	const _email = req.body.data.email;
	const _name = req.body.data.websiteName;

	if (req.body) {
		try {
			await Users.findOneAndUpdate(
				{ email: user.email, _id: user.id },
				{ $pull: { websites: { email: _email, name: _name } } },
				{ safe: true, multi: true }
			);
			res.json({
				status: 'ok',
				data: 'Removed',
			});
		} catch (err) {
			res.json({
				status: 'error',
				error: 'This error:' + err,
			});
		}
	} else {
		res.json({
			status: 'error',
			error: 'No sufficient data received',
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
				res.json({
					status: 'error',
					error: 'Username already in use',
				});
			} else {
				console.log(err.message);
				res.json({
					status: 'error',
					error: err.message,
				});
			}
		}
	}

	if (req.body.data.fullName) {
		console.log('received fullname');
		try {
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
