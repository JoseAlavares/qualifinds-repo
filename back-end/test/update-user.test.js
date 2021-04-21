require("dotenv").config();
const assert = require("chai").assert;
const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = require("chai").expect;
const mongoose = require("mongoose");

const index = "http://localhost:3001";
const utils = require("../src/utils/utils.functions");

chai.use(chaiHttp);

const UserModel = require("../src/models/user/user.model");

//Unit testing
/*describe("Unit testing for update user", () => {
    it("Test if the UserModel works fine if the document is updated", () => {
        const userData = new UserModel();
        userData.update({_id: "5f09326661f05f344ef759ee"}, {
            name: "José Alvarez",
            email: "alvaresvaldes89@gmail.com",
            password: utils.generatePassword("admin"),
            modified_at: new Date().toISOString(),
            modified_by: "system"
        })
        .then(result => {            
            assert.isTrue(false);
        })
        .catch(err => {
            assert.ifError(err);
        });
    });
});*/

//Integration testing
describe("Integration testing", () => {
    it("Validate when not exists the token in the request", () => {
        chai.request(index)
        .put("/api/users")
        .send({})
        .then(result => {
            expect(result).to.have.status(401);
        })
        .catch(err => {
            assert.ifError(err);
        });
    });

    it("Validate when the token exists but not body params", () => {
        chai.request(index)
        .put("/api/users")
        .send({})
        .then(result => {
            expect(result).to.have.status(403);
            expect(result).to.have.property("messge").eql("El formato de la solicitud es incorrecto");
        })
        .catch(err => {
            assert.ifError(err);
        });
    });

    it("Validate when the token exists but not body params", () => {
        chai.request(index)
        .put("/api/users")
        .send({})
        .then(result => {
            expect(result).to.have.status(403);
            expect(result).to.have.property("messge").eql("El formato de la solicitud es incorrecto");
        })
        .catch(err => {
            assert.ifError(err);
        });
    });

    it("Validate when the service works fine", () => {
        const token = utils.generateToken(1, "admin");
        chai.request(index)
        .put("/api/users")
        .set({
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        })
        .send({
            id: "5f0f8ef5d3c23d355ba4ffb7",
            name: "Update by integration testing",
            email: "alvaresvaldes89@gmail.com",
            password: utils.generatePassword("test"),
            modified_at: new Date().toISOString(),
            modified_by: "integration_tesing"
        })
        .then(result => {
            expect(result).to.have.status(201);
            expect(result).to.have.property("messge").eql("update successfull");
        })
        .catch(err => {
            assert.ifError(err);
        });
    });
})