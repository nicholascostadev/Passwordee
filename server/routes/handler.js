const express = require('express');
const router = express.Router();
const Schemas = require('../models/Schemas.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const saltRounds = process.env.SALT_ROUNDS;

router.post('/register', async (req, res) => {
	const password = req.body.password;
	if (!password) {
		console.log('No empty passwords');
		res.json({
			status: 'error',
			error: 'No empty passwords',
		});
	} else if (password.length < 6) {
		console.log('Password needs to have at least 6 characters');
		res.json({
			status: 'error',
			error: 'No empty passwords',
		});
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
							console.log('Created New User');
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
						{ id: foundUser._id, email: foundUser.email },
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

module.exports = router;
