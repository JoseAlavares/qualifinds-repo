require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());

//Modules
const user = require("./modules/user/user.network");
const userHistory = require("./modules/user-history/user-history.network");
const todo = require("./modules/todos/todo.network")

app.get("/", (req, resp) => {
    return resp.status(200).json({
        timestamp: new Date().toISOString(),
        status: 200,
        message: "successfull"
    });
});

app.use("/", user);
app.use("/", userHistory);
app.use("/", todo);

app.listen(PORT, async () => {
    console.log(`Server start in the port: ${PORT}`);    
});