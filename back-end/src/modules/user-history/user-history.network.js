const express = require("express");
const dummyData = require("../../dummy-data.json");
const router = express.Router();
const middlewares = require("../../middlewares/access-token");
const utils = require("../../utils/utils.functions");

router.get("/api/user/history/:userId", middlewares.isLoggedIn, (req, resp) => {
    //Dummy data for user history
    if(dummyData instanceof Object){
        return utils.responseNetwork(
            resp,
            false,
            200,
            "successfull",
            dummyData
        );
    }

    return utils.responseNetwork(
        resp,
        true,
        500,
        "Ocurrio un error en el servidor"
    );
});

module.exports = router;