const express = require('express');
const router = express.Router();

const db = require('../src/database');
const C_user = db.getCollection("users");

router.get('/:id', getID);
router.delete('/:id', deleteID);
router.get('/', getAll);
router.post('/', post);
router.patch('/:id', patchID);
router.get('/:id/friends', getFriends);
router.post('/:id/friends', postFriends);

function getFriends(req, res) {
    let id = req.params.id;
    let user = C_user.get(id);
    res.json(user.friends);
}

function getID(req, res) {
    let id = req.params.id;
    let user = C_user.get(id);
    res.json(user);
}

function deleteID(req, res) {
    let id = req.params.id;
    let user = C_user.get(id);
    res.json(user);
    C_user.remove(user);
}

function getAll(req, res) {
    let users = [];
    let dbUsers;
    if (req.query.minLegs !== undefined || req.query.color !== undefined) {

        let minLegs = req.query.minLegs;
        let colorWanted = req.query.color;

        function hatmindestensBeine(obj) {
            if (colorWanted !== undefined) {
                if (obj.color !== colorWanted) {
                    return false;
                }
            }
            if (minLegs !== undefined) {
                return (parseInt(obj.legs) >= parseInt(minLegs));
            }
            return true;
        }

        dbUsers = C_user.where(hatmindestensBeine);
    } else {
        dbUsers = C_user.find();
    }

    for (let i = 0; i < dbUsers.length; i++) {
        let value = dbUsers[i];
        users.push([value.name, value.$loki]);
    }
    res.json(users);
}

function post(req, res) {
    let user = req.body;
    C_user.insert(user);
    res.json(user);
}

function postFriends(req, res) {
    let id = req.params.id;
    let user = C_user.get(id);
    let friendlist = user.friends;

    let friendsName = req.body.name;
    friendlist.push(friendsName);
    user.friends = friendlist;
    C_user.update(user);

    res.json(user);
}

function patchID(req, res) {
    let id = req.params.id;
    let user = C_user.get(id);

    if (req.body.name !== undefined) {
        user.name = req.body.name;
    }
    if (req.body.legs !== undefined) {
        user.legs = req.body.legs;
    }
    C_user.update(user);
    res.json(user);
}

module.exports = router;
