const express = require('express');
const router = express.Router();
const db = require("../src/database");
const C_Users = db.getCollection("users");

router.get('/sum-legs', sumlegs);
router.get('/sum-legs/:color', sumLegsColor);

function sumlegs(req, res) {
    let dbUsers = C_Users.find();
    sumlegsFromUsers(dbUsers, req, res);
}

function sumLegsColor(req, res) {
    let colorWanted = req.params.color;

    function userByColor(obj) {
        if (obj.color === colorWanted) {
            return true;
        } else {
            return false;
        }
    }

    let dbUsers = C_Users.where(userByColor);
    sumlegsFromUsers(dbUsers, req, res);
}

function sumlegsFromUsers(dbUsers, req, res) {

    //{ "users": 3, "sum_legs": 10, "avg_legs": 3.33333 }

    let result = {"users": 0, "sum_legs": 0, "avg_legs": 0};


    for (let i = 0; i < dbUsers.length; i++) {
        let value = dbUsers[i];
        result.users++;
        result.sum_legs += value.legs;
    }
    result.avg_legs = result.sum_legs / result.users;
    res.json(result);

}

module.exports = router;
