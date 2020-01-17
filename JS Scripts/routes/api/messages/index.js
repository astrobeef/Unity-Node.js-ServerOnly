const router = require("express").Router();
const messagesController = require("../../../controllers/messagesController");

router.route("/")
    .get(messagesController.findAll);

router.route("/create")
    .post(messagesController.createOne);

module.exports = router;