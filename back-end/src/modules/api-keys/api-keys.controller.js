const ApiKeysModel = require("../../models/api-keys/api-keys.model");

const findApiKey = (apiKey) => {
    return new Promise((resolve, reject) =>{
        ApiKeysModel.findOne({api_key: apiKey, active: 1}, (err, result) => {
            if(err){
                console.error(err.message);
                reject({error: err});
            }
    
            if(result) {
                resolve({valid: true});
            }

            resolve({valid: false});
        });
    });
};

module.exports = {
    findApiKey
};