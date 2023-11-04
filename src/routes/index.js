const router = require("express").Router();
const { data, users, register, login } = require("../controllers/index");
const { userMiddleware } = require("../middlewares/middleware");

router.post("/register", register);
router.post("/login", login);
router.use(userMiddleware);
router.get("/data", data);
router.get("/users", users);

module.exports = router;
