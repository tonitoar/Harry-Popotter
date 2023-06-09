const express = require("express");
const router = express.Router();

// ℹ️ Handles password encryption
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

// How many rounds should bcrypt run the salt (default - 10 rounds)
const saltRounds = 10;

// Require the User model in order to interact with the database
const User = require("../models/User.model");

// Require necessary (isLoggedOut and isLiggedIn) middleware in order to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

const multer = require("multer")
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configuration 
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'potter-pics',
    allowed_formats: ["jpg", "png", "jpeg", "webp"]
    // format: async (req, file) => 'png', // supports promises as well
    // public_id: (req, file) => 'computed-filename-using-request',
  },
});


// const upload = multer ({dest: "./public/uploads/"})
const upload = multer({storage})
//upload.single("image")
//upload.any()

// GET /auth/signup
router.get("/signup", isLoggedOut,  (req, res) => {
  res.render("auth/signup");
});

// POST /auth/signup
router.post("/signup", isLoggedOut, upload.single("image"), (req, res) => {
  const { username, email, password, patronus, creature, item, housePhoto, spells } = req.body;

  console.log("----> FILE:", req.file)
  console.log("----> BODY:", req.body)
  //req.file
  //req.files

  // Check that username, email, and password are provided
  if (username === "" || email === "" || password === "") {
    res.status(400).render("auth/signup", {
      errorMessage:
        "All fields are mandatory. Please provide your username, email and password.",
    });

    return;
  }

  if (password.length < 6) {
    res.status(400).render("auth/signup", {
      errorMessage: "Your password needs to be at least 6 characters long.",
    });

    return;
  }

  //   ! This regular expression checks password for special characters and minimum length
  /*
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res
      .status(400)
      .render("auth/signup", {
        errorMessage: "Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter."
    });
    return;
  }
  */

  // Create a new user - start by hashing the password
  bcrypt
    .genSalt(saltRounds)
    .then((salt) => bcrypt.hash(password, salt))
    .then((hashedPassword) => {
      // Create a user and save it in the database
      // return User.create({ username, email, password: hashedPassword, profileImageSrc: "/uploads/" + req.file.filename });
      // return User.create({ username, email, password: hashedPassword, profileImageSrc:req.file.path });
      const newUser = new User({
        email,
        username,
        password: hashedPassword,
        patronus,
        creature,
        item,
        //housePhoto
      });
      return newUser.save();
    })
    .then((user) => {
      console.log("lets go login")
      res.redirect("/auth/login");
    })
    .catch((error) => {
      console.log("error", error)
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).render("auth/signup", { errorMessage: error.message });
      } else if (error.code === 11000) {
        res.status(500).render("auth/signup", {
          errorMessage:
            "Username and email need to be unique. Provide a valid username or email.",
        });
      } else {
       // next(error);
      }
    });
});

// GET /auth/login
router.get("/login", isLoggedOut, (req, res) => {
  res.render("auth/login");
});

// POST /auth/login
router.post("/login", isLoggedOut, (req, res, next) => {
  const { username, email, password } = req.body;

  // Check that username, email, and password are provided
  if (username === "" || email === "" || password === "") {
    res.status(400).render("auth/login", {
      errorMessage:
        "All fields are mandatory. Please provide username, email and password.",
    });

    return;
  }

  // Here we use the same logic as above
  // - either length based parameters or we check the strength of a password
  if (password.length < 6) {
    return res.status(400).render("auth/login", {
      errorMessage: "Your password needs to be at least 6 characters long.",
    });
  }

  // Search the database for a user with the email submitted in the form
  User.findOne({ email })
    .then((user) => {
      // If the user isn't found, send an error message that user provided wrong credentials
      if (!user) {
        res
          .status(400)
          .render("auth/login", { errorMessage: "Wrong credentials." });
        return;
      }

      // If user is found based on the username, check if the in putted password matches the one saved in the database
      bcrypt
        .compare(password, user.password)
        .then((isSamePassword) => {
          if (!isSamePassword) {
            res
              .status(400)
              .render("auth/login", { errorMessage: "Wrong credentials." });
            return;
          }

          // Add the user object to the session object
          req.session.currentUser = user.toObject();
          // Remove the password field
          delete req.session.currentUser.password;

          res.redirect("/welcome");
        })
        .catch((err) => next(err)); // In this case, we send error handling to the error handling middleware.
    })
    .catch((err) => next(err));
});


// router.get("/profile/:userId", (req, res, next) => {
//   const { userId } = req.params;

//   User.findById (userId)
//   .then(user => {
//     res.render("/profile", user)
//   })
//   .catch((err) => next(err));

// })

// GET /auth/logout
router.get("/logout", isLoggedIn, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).render("auth/logout", { errorMessage: err.message });
      return;
    }

    res.redirect("/");
  });
});

module.exports = router;
