const UserModel = require("../../models/user/user.model");
const utils = require("../../utils/utils.functions");       
const mongoose = require('mongoose')
const URI = `mongodb://mongo:27017/mern-project-db`        
mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,            
})
.catch(err => console.error(err.message));

const signIn = (userData) => {
    const user = userData.user;
    const password = userData.password;    
    
    return new Promise((resolve, reject) => {
        UserModel.findOne({email: user, active: 1}, (err, result) => {
            if(err) {
                console.error(err.message)
                return reject({
                    message: "Ocurrio un error", 
                    error: "Ocurrio un error", 
                    status: 500
                });
            }

            if(result) {
                const hashPassword = result.password;
                let validPassword = utils.validatePassword(password, hashPassword);

                if(validPassword) {
                    const _id = result._id;
                    const user = result.email;

                    const token = utils.generateToken(_id, user);

                    return resolve({
                        message: "successfull", 
                        status: 200,                        
                        user: {
                            token: token,
                            id: result._id,
                            name: result.name,
                            email: result.email,
                            created_at: result.created_at
                        }
                    });                
                }
                
                return reject({
                    message: "Usuario o contraseña incorrectos",
                    error: "Usuario o contraseña incorrectos",
                    status: 401
                });                
            }

            return reject({
                message: "No existe el usuario", 
                status: 404,
                error: "No existe el usuario"
            });
        });
    });
};

const signUp = (userData) => {
    return new Promise((resolve, reject) => {
        return resolve({ok: "is ok"});
    });
};

const getUsers = (isAuthenticated) => {        
    return new Promise((resolve, reject) => {        
        //If the user is authenticated the server returns all details of users
        //if not so the server only return 'name' and 'active'        
        UserModel.find({active: 1}, "_id name email created_at active").exec()
            .then((data) => {
                if(!isAuthenticated) {
                    data = data.map((d) => ({name: d.name, active: d.active}));
                }

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

const createUser = (data) => {
    return new Promise(async (resolve, reject) => {
        let errors = 0;
        (!data.password) ? errors++ : null;
        (!data.name) ? errors++ : null;
        (!data.email) ? errors++ : null;
        
        if(errors > 0) {
            let text = "";
            let errorMessages = Object.keys(data).map(key => {
                if(data[key] === undefined || !data[key]) {
                    text += `El campo ${key || "n/a"} esta vacio`;
                    return text;
                }

            });

            return reject({message: errorMessages, error: true, status: 403});
        }

        try {
            let userData = new UserModel({
                user: data.user,
                password: utils.generatePassword(data.password),
                name: data.name,
                email: data.email,
                created_at: new Date().toISOString(),
                created_by: "system",
                active: 1
            });

            UserModel.findOne({
                $or: [{"name": data.name}, {"email": data.email}]
            }, (err, docs) => {
                
                if(err) {
                    console.error(err.message)
                    return reject({message: "Ocurrio un error en el servidor", error: err, status: 500});
                }

                if(docs) {
                    return reject({message: "El nombre o correo ya esta registrado", error: err, status: 400});
                }
                
                userData.save()
                .then((data) => {
                    return resolve({message:"Usuario creado exitosamente", data:data});
                })
                .catch((err) => {
                    console.error(err.message);
                    return reject({message: "Ocurrio un error 1", error: err, status: 500});
                });
            });
            
        } catch(e){
            console.error(e.message);
            return reject({message: "Ocurrio un error 2", error: e, status: 500});
        }
    });
};

const updateUser = (userData) => {
    return new Promise((resolve, reject) => {

        let newUserData = {
            name: userData.name,
            email: userData.email,
            modified_at: new Date().toISOString(),
            modified_by: "system"
        };

        if(userData.password) {
            newUserData.password = utils.generatePassword(userData.password);
        }

        UserModel.update({
                _id: userData.id
            }, 
            newUserData)
            .then(result => {
                if(result.n) {
                    return resolve({updated: true});
                }

                return resolve({updated: false});
            })
            .catch(err => {
                console.error(err.message)
                return reject({error: "Ocurrio un error"});
            });
    });
};

const getDataUser = (id) => {
    return new Promise((resolve, reject) => {
        UserModel.findOne({_id: id, active: 1}, (err, result) => {
            if(err) {
                console.error(err.message)
                return reject({
                    message: "Ocurrio un error", 
                    error: "Ocurrio un error", 
                    status: 500
                });
            }
            
            if(result) {            
                return resolve({
                    message: "successfull", 
                    status: 200,                        
                    user: {
                        id: result._id,
                        name: result.name,
                        email: result.email,
                        created_at: result.created_at
                    }
                });                        
            }
    
            return reject({
                message: "No existe el usuario", 
                status: 404,
                error: "No existe el usuario"
            });
        });
    });
};

const deleteUser = (id) => {
    return new Promise((resolve, reject) => {
        UserModel.updateOne({_id: id}, {
            active: 0, 
            modified_at: new Date().toISOString(), 
            modified_by: "system"
        })
        .then(result => {
            if(result.nModified) {
                return resolve({
                    status: 201,
                    message: "successfull",                    
                });    
            }

            return reject({
                status: 404,
                message: "El usuario no existe",
            });
            
        })
        .catch(err => {
            console.error(err.message)
            return reject({
                status: 500,
                message: "Ocurrio un error"
            });    
        });
        
    });
};

module.exports = {
    signIn,
    signUp,
    getUsers,
    createUser,
    updateUser,
    getDataUser,
    deleteUser
};