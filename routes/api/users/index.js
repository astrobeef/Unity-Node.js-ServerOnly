const router = require("express").Router();
const usersController = require("../../../controllers/usersController");

router.route("/create")
    .post(usersController.createOne);

router.route("/:id")
    .get(usersController.findOne);

module.exports = router;