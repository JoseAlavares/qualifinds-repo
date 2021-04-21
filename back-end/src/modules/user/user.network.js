const express = require("express");
const userController = require("./user.controller");
const apiKeysController = require("../api-keys/api-keys.controller");
const router = express.Router();
const middlewares = require("../../middlewares/access-token");
const utils = require("../../utils/utils.functions");
const userModel = require("../../models/user/user.model");
const { responseNetwork } = require("../../utils/utils.functions");

/**
 * @author José Francisco AlvarezValdez<alvaresvaldes89@outlook.es>
 * @description Login service for users
 * @param req <Object> contains data body from a form
 * @param resp <Object> response of the server
 * @returns resp <JSON> return data of the server
 * @date 2020-07-15
 */
router.post("/auth/signin", async (req, resp) => {    
    if(!req.headers['authorization']){
        return utils.responseNetwork(
            resp,
            true,
            401,
            "Acceso no autorizado"
        );
    }    
    
    const apiKey = req.headers['authorization'].replace("ApiKey ", "");

    await apiKeysController.findApiKey(apiKey)
        .then((result) => {
            console.log(result)
            if(!result.valid) {
                return utils.responseNetwork(
                    resp,
                    true,
                    401,
                    "Acceso no autorizado"
                );
            }

            if(Object.keys(req.body).length === 0 ||
                !req.body.user ||
                !req.body.password) {
                return utils.responseNetwork(
                    resp,
                    true,
                    400,
                    "El formato de la solicitud es incorrecto"
                );
            }

            const userData = req.body;

            userController.signIn(userData)
                .then((data) => {
                    return utils.responseNetwork(
                        resp, 
                        false,
                        data.status, 
                        data.message,
                        data.user
                    );        
                })
                .catch(err => {
                    console.error(err.message)
                    return utils.responseNetwork(
                        resp,
                        true,
                        err.status,
                        err.message
                    );
                });
        })
        .catch((err) => {
            console.error(err.message)
            return utils.responseNetwork(
                resp,
                true,
                500,
                "Ocurrio un error"
            );
        });
    
});

/**
 * @author José Francisco AlvarezValdez<alvaresvaldes89@outlook.es>
 * @description Service to get all users from the db
 * @param req <Object> contains data body from a form
 * @param resp <Object> response of the server
 * @returns resp <JSON> return data of the server
 * @date 2020-07-15
 */
router.get("/api/users", async (req, resp) => {    
    let token = req.headers['authorization'] || "";
    token = (!token) ? "" : token. replace("Bearer ", "");
    const isAuthenticated = await utils.verifyToken(token);

    return userController.getUsers(isAuthenticated)
        .then((data) => {
            return utils.responseNetwork(
                resp,
                false,                            
                200,
                "successfull",
                data                            
            ); 
        })
        .catch((error) => {
            return utils.responseNetwork(
                resp,
                true,
                500,
                "Ocurrio un error"                            
            ); 
        });    
});

/**
 * @author José Francisco AlvarezValdez<alvaresvaldes89@outlook.es>
 * @description Service to create new users
 * @param req <Object> contains data body from a form
 * @param resp <Object> response of the server
 * @returns resp <JSON> return data of the server
 * @date 2020-07-15
 */
router.post("/api/users", (req, resp) => {
    if(req.body === undefined || !Object.keys(req.body).length) {
        return utils.responseNetwork(resp, true, 403, "El formato de la solicitud es incorrecto");
    }

    return userController.createUser(req.body)
        .then((data) => {
            return utils.responseNetwork(resp, false, 201, data.message);
        })
        .catch((err) => {
            return utils.responseNetwork(resp, true, err.status, err.message);
        });
});

/**
 * @author José Francisco AlvarezValdez<alvaresvaldes89@outlook.es>
 * @description Service to update user data
 * @param req <Object> contains data body from a form
 * @param resp <Object> response of the server
 * @returns resp <JSON> return data of the server
 * @date 2020-07-15
 */
router.put("/api/users", middlewares.isLoggedIn, (req, resp) => {
    if(req.body === undefined || 
        !Object.keys(req.body).length ||
        !req.body.id ||
        !req.body.name) {
        return utils.responseNetwork(
            resp, 
            true, 
            403, 
            "El formato de la solicitud es incorrecto"
        );
    }
    const userData = req.body;
    return userController.updateUser(userData)
        .then(result => {
            if(result.updated) {
                return utils.responseNetwork(
                    resp, 
                    false, 
                    201,
                    "successfull"
                );
            }
            
            return utils.responseNetwork(
                resp, 
                true, 
                500,
                "Error"
            );
        })
        .catch(err => {
            return utils.responseNetwork(
                resp, 
                true, 
                500,
                "Ocurrio un error"
            );
        });
    
});

/**
 * @author José Francisco AlvarezValdez<alvaresvaldes89@outlook.es>
 * @description Service to delete a user account
 * @param req <Object> contains data body from a form
 * @param resp <Object> response of the server
 * @returns resp <JSON> return data of the server
 * @date 2020-07-15
 */
router.delete("/api/users", middlewares.isLoggedIn, (req, resp) => {
    if(
        req.body === undefined || 
        !Object.keys(req.body).length || 
        !req.body.id
    ) {
        return utils.responseNetwork(
            resp, 
            true, 
            403, 
            "El formato de la solicitud es incorrecto"
        );
    }

    const id = req.body.id;        
    userController.deleteUser(id)
        .then(result => {
            return utils.responseNetwork(
                resp,
                false,
                201,
                "La cuenta fue desactivada"
            );
        })
        .catch(err => {
            return utils.responseNetwork(
                resp,
                true,
                err.status,
                err.message
            );
        });
});

/**
 * @author José Francisco AlvarezValdez<alvaresvaldes89@outlook.es>
 * @description Service to get all information by a user
 * @param req <Object> contains data body from a form
 * @param resp <Object> response of the server
 * @returns resp <JSON> return data of the server
 * @date 2020-07-15
 */
router.get("/api/users/:userId", middlewares.isLoggedIn, (req, resp) => {
    if(!req.params.userId) {
        return utils.responseNetwork(
            resp,
            true,
            403,
            "El formato de la solicitud es incorrecto"
        );
    }

    return userController.getDataUser(req.params.userId)
        .then(result => {
            return utils.responseNetwork(
                resp,
                false,
                result.status,
                result.message,
                result.user
            );
        })
        .catch(err =>  {
            return utils.responseNetwork(
                resp,
                true,
                err.status,
                err.message
            );
        });    
});

module.exports = router;