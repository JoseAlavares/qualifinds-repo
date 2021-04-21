const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const bcrypt = require("bcrypt");

const JWT_PASSWORD = process.env.JWT_PASSWORD;

const responseNetwork = (responseHttp, error, statusCode,  message, data) => {
	let response = {};
	if(error) response.error = true;
	if(data) response.data = data;

	response.time_stamp = new Date().toISOString();
	response.status_code = statusCode;
	response.message = message;

	return responseHttp.status(statusCode).json(response);
}

const generatePassword = (plainText) => {
	const saltRounds = 10;
	return bcrypt.hashSync(plainText || 'admin', saltRounds);
};

const validatePassword = (plainText, hash) => {
	return bcrypt.compareSync(plainText, hash);
};

const generateToken = (id, user) => {
	return jwt.sign(
		{data: {
			id: id, 
			user: user
		}}, 
		JWT_PASSWORD
	);
};

const verifyToken = async (token) => {
	if(!token) {
		return false;
	}

	const _token = token.replace('Bearer ', '');
	let valid = false;
	
	try {
		await jwt.verify(_token, JWT_PASSWORD, function(error, token) {
			if(error) {
				console.error(error);
				valid = false;
			}
			else {				
				valid = true;
			}
		});

		return valid;
	} catch(err) {
		//console.log(err);
		throw new Error('Ocurrio un error');
	}
};

module.exports = {
	responseNetwork,
	generatePassword,
	validatePassword,
	generateToken,
	verifyToken
};