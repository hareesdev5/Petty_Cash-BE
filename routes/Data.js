const express = require("express");
const Router = express.Router();
const Auth = require("../common/Auth");

const DataController = require("../controller/Data");

Router.post("/i_value", Auth.validate, DataController.initialAmount);
Router.get("/", Auth.validate, DataController.getData);
Router.delete("/:id", DataController.DeleteValue);
Router.put("/cashIn", Auth.validate, DataController.cashIn);
Router.put("/cashOut", Auth.validate, DataController.cashOut);
Router.get("/getDataByCashIn", Auth.validate, DataController.getDataByCashIn);
Router.get("/getDataByCashOut", Auth.validate, DataController.getDataByCashOut);

module.exports = Router;
