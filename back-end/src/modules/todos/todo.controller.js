const TodoModel = require("../../models/todo/todo.model");
const utils = require("../../utils/utils.functions");       
const mongoose = require('mongoose')
const URI = `mongodb://mongo:27017/mern-project-db`        
mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,            
})
.catch(err => console.error(err.message));

const getTodos = () => {        
    return new Promise((resolve, reject) => {        
        //If the user is authenticated the server returns all details of users
        //if not so the server only return 'name' and 'active'        
        TodoModel.find({}, "_id name title completed").exec()
            .then((data) => {                
                return resolve(data);
            })
            .catch((err) => {
                console.error(err.message)
                return reject({error: err});
            })
            .finally(() => {
                //mongoose.connection.close();
            });
    });
};

const createTodo = (data) => {
    return new Promise(async (resolve, reject) => {
        let errors = 0;
        if(!data.name) errors++;
        if(!data.title) errors++;
        
        if(errors > 0) {
            let text = "";
            let errorMessages = Object.keys(data).map(key => {
                if(data[key] === undefined || !data[key]) {
                    text += `The field ${key || "n/a"} cant be empty`;
                    return text;
                }

            });

            return reject({message: errorMessages, error: true, status: 403});
        }

        try {
            let todoData = new TodoModel({
                name: data.name,        
                title: data.title,
                completed: false
            });

            TodoModel.findOne({"name": data.name}, (err, docs) => {
                
                if(err) {
                    console.error(err.message)
                    return reject({message: "Error in ther server 1", error: err, status: 500});
                }

                if(docs) {
                    return reject({message: "Already exists a todo with the same name", error: err, status: 400});
                }
                
                todoData.save()
                .then((data) => {
                    return resolve({message:"Successful", data:data});
                })
                .catch((err) => {
                    console.error(err.message);
                    return reject({message: "Error in the server 2", error: err, status: 500});
                });
            });
            
        } catch(e){
            console.error(e.message);
            return reject({message: "Error in the server 3", error: e, status: 500});
        }
    });
};

const updateTodo = (todoData) => {
    return new Promise((resolve, reject) => {

        let newTodoData = {
            name: todoData.name,
            title: todoData.title,            
        };

        TodoModel.updateOne({
                _id: todoData.id
            }, 
            newTodoData)
            .then(async result => {
                if(result.n) {
                    const todo = await TodoModel.find({_id: todoData.id})
                    return resolve({updated: true, data: todo});
                }

                return resolve({updated: false});
            })
            .catch(err => {
                console.error(err.message)
                return reject({error: "Ocurrio un error"});
            });
    });
};

const getDataTodo = (id) => {
    return new Promise((resolve, reject) => {
        TodoModel.findOne({_id: id}, (err, result) => {
            if(err) {
                console.error(err.message)
                return reject({
                    message: "Error in the server", 
                    error: "Error in the server", 
                    status: 500
                });
            }
            
            if(result) {            
                return resolve({
                    message: "successfull", 
                    status: 200,                        
                    result
                });                        
            }
    
            return reject({
                message: "This todo not exists", 
                status: 404,
                error: "This todo not exists"
            });
        });
    });
};

const deleteTodo = (id) => {
    return new Promise((resolve, reject) => {
        TodoModel.deleteOne({_id: id})
        .then(result => {            
            return resolve({
                status: 201,
                message: "successfull",                    
            })            
        })
        .catch(err => {
            console.error(err.message)
            return reject({
                status: 500,
                message: "Error in the server"
            });    
        });
        
    });
};

const completeTodo = (id) => {
    return new Promise((resolve, reject) => {
        TodoModel.updateOne({_id: id}, {completed: true}, (err, result) => {
            if(err) {
                console.error(err.message)
                return reject({
                    message: "Error in the server", 
                    error: "Error in the server", 
                    status: 500
                });
            }
            
            if(result.n) {            
                return resolve({
                    message: "successfull", 
                    status: 201,                        
                    result
                });                        
            }
    
            return reject({
                message: "This todo not exists", 
                status: 404,
                error: "This todo not exists"
            });
        });
    });
}

module.exports = {    
    getTodos,
    createTodo,
    updateTodo,
    getDataTodo,
    deleteTodo,
    completeTodo
};