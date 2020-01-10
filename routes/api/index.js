const router = require("express").Router();
const playersRoutes = require("./players");
const userRoutes = require("./users");

router.use("/players", playersRoutes);

router.use("/users", userRoutes);

module.exports = router;