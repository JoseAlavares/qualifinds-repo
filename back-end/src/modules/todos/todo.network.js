const express = require("express");
const todoController = require("./todo.controller");
const router = express.Router();
const middlewares = require("../../middlewares/access-token");
const utils = require("../../utils/utils.functions");

router.get("/api/todo", middlewares.isLoggedIn, async (req, resp) => {        
    return todoController.getTodos()
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
                "Error in the server"                            
            ); 
        });    
});

router.post("/api/todo", middlewares.isLoggedIn, (req, resp) => {
    if(req.body === undefined || !Object.keys(req.body).length) {
        return utils.responseNetwork(resp, true, 422, "Unproccessable entity");
    }

    return todoController.createTodo(req.body)
        .then((data) => {
            return utils.responseNetwork(resp, false, 201, data.message, data.data);
        })
        .catch((err) => {
            return utils.responseNetwork(resp, true, err.status, err.message);
        });
});

router.put("/api/todo", middlewares.isLoggedIn, (req, resp) => {
    if(req.body === undefined || 
        !Object.keys(req.body).length ||
        !req.body.id ||
        !req.body.name ||
        !req.body.title) {
        return utils.responseNetwork(
            resp, 
            true, 
            403, 
            "El formato de la solicitud es incorrecto"
        );
    }
    const todoData = req.body;
    return todoController.updateTodo(todoData)
        .then(result => {
            if(result.updated) {
                return utils.responseNetwork(
                    resp, 
                    false, 
                    201,
                    "successfull",
                    result.data
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

router.delete("/api/todo/:id", middlewares.isLoggedIn, (req, resp) => {
    if(
        req.params === undefined || 
        !Object.keys(req.params).length || 
        !req.params.id
    ) {
        return utils.responseNetwork(
            resp, 
            true, 
            422, 
            "Unproccessable entity"
        );
    }

    const id = req.params.id;        
    todoController.deleteTodo(id)
        .then(result => {
            return utils.responseNetwork(
                resp,
                false,
                201,
                "Deleted successfull"
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

router.get("/api/todo/:id", middlewares.isLoggedIn, (req, resp) => {
    if(!req.params.id) {
        return utils.responseNetwork(
            resp,
            true,
            422,
            "Unproccessable entity"
        );
    }

    return todoController.getDataTodo(req.params.id)
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

router.put("/api/todo/:id", middlewares.isLoggedIn, (req, resp) => {
    if(!req.params.id) {
        return utils.responseNetwork(
            resp, 
            true, 
            403, 
            "El formato de la solicitud es incorrecto"
        );
    }

    const todoData = req.params.id;
    return todoController.completeTodo(todoData)
        .then(result => {
            if(result) {
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

module.exports = router;