const express = require('express');
const routesHandler = require('./routes/handler.js');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', routesHandler);

mongoose
	.connect(process.env.DB_URI)
	.then(() => console.log('Connected to Database'))
	.catch(err => console.log(err));

const PORT = 5000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
