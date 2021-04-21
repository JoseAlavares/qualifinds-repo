const utils = require("../utils/utils.functions");

const middlewares = {
	isLoggedIn : async (request, response, next) =>{		
		
		var token = request.headers['authorization'] || '';
		
		if(!token) {
			return utils.responseNetwork(
				response,
				true,
				401,
				"Acceso no autorizado"
			);			
		}
		
		let isValid = false;
		isValid = await utils.verifyToken(token);

		if(isValid) {
			return next();
		}

		return utils.responseNetwork(
			response,
			true,
			401,
			"Acceso no autorizado"
		);
	}
};

module.exports = middlewares;