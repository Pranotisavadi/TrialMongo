var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Userlist = require("../models/Userlist");
const saltRounds = bcrypt.genSaltSync(Number(process.env.SALT_FACTOR));
require("dotenv").config();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

// router.post("/list", async (req, res, next) => {
//   const { newListName } = req.body;

//   const user = await Userlist.findOne({
//     username: username,
//   });
// });

router.post("/register", async function (req, res, next) {
  const { username, password, email } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    //create and store user
    const result = await Userlist.create({
      username: username,
      password: hashedPassword,
      email: email,
      lists: {},
    });
    console.log(result);
    res.redirect("../login");
    
  } catch (err) {
    res.send(err);
  }
});

router.post("/login", async (req, res, next)=>{
  const { username, password } = req.body;

  const user = await Userlist.findOne({
   username: username,
     //first username is the title of the column in db, second username is the username from the body
  });

    if (user) {
      const comparePasswords = bcrypt.compareSync(password, Userlist.password);
      // console.log(comparePasswords);
      if (comparePasswords === true) {
        const token = jwt.sign(
          {
            data: Userlist.username,
            // userId: Userlist._id,
          },
          process.env.SECRET_KEY,
          { expiresIn: "1h" }
        );
  
        res.cookie("token", token);
        res.redirect(`/profile/${Userlist._id}`);
      } else {
        res.send("incorrect password, try again");
      }
    } else {
      res.send("cannot find user");
    }
  });
  
   

module.exports = router;







