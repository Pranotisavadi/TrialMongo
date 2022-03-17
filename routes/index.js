var express = require("express");
const Userlist = require("../models/Userlist");
var router = express.Router();
const isValidToken = require("../middleware/isValidToken");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index");
 });
// router.get("/index", function (req, res, next) {
//   res.render("index");
// });

router.get("/login", function (req, res, next) {
  res.render("login");
});
router.get("/list", function (req, res, next) {
  res.render("list");
});

router.get("/register", function (req, res, next) {
  res.render("register");
});

router.get("/profile/:id", isValidToken, async function (req, res, next) {
  const { id } = req.params;

  const user = await Userlist.findOne({
    _id: id,
  });

  console.log(user);
  res.render("profile", { name: user.username });
});
module.exports = router;
