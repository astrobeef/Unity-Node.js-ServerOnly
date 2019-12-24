const router = require("express").Router();
const playersRoutes = require("./players");

router.use("/players", playersRoutes);

module.exports = router;