const router = require("express").Router();
const playersRoutes = require("./players");
const userRoutes = require("./users");
const messagesRoutes = require("./messages")

router.use("/players", playersRoutes);

router.use("/users", userRoutes);

router.use("/messages", messagesRoutes);

module.exports = router;