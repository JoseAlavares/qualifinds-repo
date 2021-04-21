require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports = class JWTClass{
	
	constructor(){
		//Empty constructor
		this.password = "esta es mi clave privada $&$$#489";
	}

	generateJWT(id, user){
		const u = {
			"user":user,
			"id":id
		};

		let token;
		return token = jwt.sign(u, this.password, {expiresIn: 60*60*24});
	}

	async validateJWT(token){
        let validToken = false;
		const _token = token.replace("Bearer ", "");

        try {
            await jwt.verify(_token, this.password, (error, token) => {
                if(error){
                    console.error(error);
                    validToken = false;
                }
                else {
                    validToken = true;
                }
            });	
        } catch(e) {
            throw new Error("Ocurrio un error");
        }
    
        return validToken;
    }    
}