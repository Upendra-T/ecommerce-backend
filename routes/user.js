const express = require("express");
const userController=require("../controller/user");
const router=express.Router();

router
.get("/:email", userController.getUser)
.post("/register",userController.createUser)
.post("/login",userController.verifyUser)
.post("/forgot-password",userController.forgotMailUser )
.post("reset-password/:token",userController.updateUserPassword)
.delete("/:email", userController.deleteUser);

exports.router=router;