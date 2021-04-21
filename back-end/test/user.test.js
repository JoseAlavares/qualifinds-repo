require("dotenv").config();
const assert = require("chai").assert;
const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = require("chai").expect;
const mongoose = require("mongoose");

const index = "http://localhost:3001";
const utils = require("../src/utils/utils.functions");

chai.use(chaiHttp);

const API_KEY = "API_KEY.cf18af7f3e4ee49d6ead6da4883ee1f73d83ac10ed28ec1addc0955a8089216e";
const USER = process.env.MONGO_DB_USER;
const DB_NAME = process.env.MONGO_DB_NAME;
const PASSWORD = process.env.MONGO_DB_PASSWORD;

const UserModel = require("../src/models/user/user.model");

//Unit testing
describe("Unit testing users functions", () => {
    it("Test si un usuario es creado correctamente", () => {
        const userData = new UserModel({
            name: "Unit testing record",
            password: utils.generatePassword("test"),
            email: "test@test.com",
            created_at: new Date().toISOString(),
            created_by: "system",
            active: 1
        });

        let isValid = false;   
        userData.save()
            .then(data => {
                let isValid = true;
                assert.isTrue(isValid);                
            })
            .catch(err => {
                assert.ifError(err);            
            })
            .finally(() => {
                //mongoose.connection.close();
            });
        
    });
    
    it("Test to validate if the token is valid", async () => {
        const token = `${"Bearer"} ${utils.generateToken(1, "admin")}`;
        let validToken = await utils.verifyToken(token);
        assert.isTrue(validToken);
    });
});

//Integration testing
describe("Integration testing /auth/signin", () => {
    it("Test to validate if the the service is working", () => {
        chai.request(index)
        .post("/auth/signin")
        .send({})
        .then((data) => {
            expect(data.body).to.have.property("message").eql("Acceso no autorizado");
            expect(data).to.have.status(401);
        })
        .catch((err) => {
            assert.ifError(err);
        });
    });

    it("Test to validate the message 'El formato de la solicitud es incorrecto'", () => {
        chai.request(index)
        .post("/auth/signin")
        .set({
			"Content-Type": "application/json",
			"Authorization": `ApiKey ${API_KEY}`
		})
        .send({})
        .then((data) => {
            //console.log(data.body);
            expect(data.body).to.have.property("message").eql("El formato de la solicitud es incorrecto");
            expect(data).to.have.status(400);
        })
        .catch((err) => {
            assert.ifError(err);
        });
    });

    it("Test to verify the body parameters do not have empty values", () =>  {
        chai.request(index)
        .post("/auth/signin")
        .set({
			"Content-Type": "application/json",
			"Authorization": `ApiKey ${API_KEY}`
		})
        .send({
            user: "",
            password: ""
        })
        .then((data) => {
            expect(data.body).to.have.property("message").eql("El formato de la solicitud es incorrecto");
            expect(data).to.have.status(400);
        })
        .catch((err) => {
            assert.ifError(err);
        });
    });

    it("Test if the service working correctly and send then token", (done) => {
        chai.request(index)
        .post("/auth/signin")
        .set({
			"Content-Type": "application/json",
			"Authorization": `ApiKey ${API_KEY}`
		})
        .send({
            user: "alvaresvaldes89@outlook.es",
            password: "admin"
        })
        .end((err, res) => {
			const token = res.body.data.token;

			expect(err).to.be.null;
			expect(res).to.have.status(200);			
			expect(token).match(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/);
			done();
		});		
    });
});

//Unit testing for get users frunctions
describe("Unit testing for get users frunctions", () => {
    it("Test to validate if the model and the query get all users from the collection", () => {
        UserModel.find({active: 1}, (err, result) => {
            if(result) {
                assert.isArray(result);
                expect(result.length).to.satisfy(function(res) {
                    return res > 0;
                });
            }
            else {
                assert.ifError(result);
            }

            mongoose.connection.close();
        });
    });

    it("Test to validate if the model and the query get an empty array", () => {
        UserModel.find({active: 0}, (err, result) => {
            if(!result) {
                assert.isNull(result);
            }
            else {
                assert.ifError(result);
            }

            mongoose.connection.close();
        });
    });
});

//Integration testing get all users service
describe("Integration testing get all users service", () => {
    it("Test to validate if the service is public but the api key is necesary", () => {
        chai.request(index)        
        .get("/api/users")
        /*.set({
			"Content-Type": "application/json",
			"Authorization": `ApiKey ${API_KEY}`
        })*/
        .send({})
        .then((data) => {
            expect(data.body).to.have.property("message").eql("Acceso no autorizado");
            expect(data).to.have.status(401);
        })
        .catch((err) => {
            assert.ifError(err);
        });
    });

    it("Test to validate if the api key is correct", () => {
        chai.request(index)
        .get("/api/users")
        .set({
            "Content-Type": "application/json",
			"Authorization": `ApiKey ${API_KEY}`
        })
        .send({})
        .then((data) => {
            expect(data).to.have.status(200);
        })
        .catch((err) => {
            assert.ifError(err);
        });
    });

    it("Test to validate if the server return an array of users", () => {
        chai.request(index)
        .get("/api/users")
        .set({
            "Content-Type": "application/json",
			"Authorization": `ApiKey ${API_KEY}`
        })
        .send({})
        .then((data) => {
            expect(data).to.have.status(200);
            expect(data.body).to.have.property("message").eql("successfull");
            assert.isArray(data.body.data);
        });
    });

    it("Validate if the structure of array users have an defined structure", () => {
        chai.request(index)
        .get("/api/users")
        .set({
            "Content-Type": "application/json",
			"Authorization": `ApiKey ${API_KEY}`
        })
        .send({})
        .then((data) => {
            assert.isArray(data.body.data);
            const structure = ["_id", "name", "email", "created_at"];
            const dataUser = Object.keys(data.body.data[0]);
            expect(dataUser).to.have.ordered.members(structure);
        })
        .catch((err) => {
            assert.ifError(err);
        });
    });
});