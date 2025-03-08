if(process.env.NODE_ENV != "Production") {
  require('dotenv').config()
}
//console.log(process.env.SECRET)

const express = require("express");
const app = express();
//const Joi = require('joi');
const mongoose = require("mongoose");
//const Listing = require("./models/listing.js");
//const Review = require("./models/review.js");
const ejsMate = require("ejs-mate");
const path = require("path");
const methodOverride = require("method-override");
//const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
//const wrapAsync = require("./utils/wrapasync.js");
//const {listingSchema} = require("./schema.js");

const listingRouter = require("./routes/listing.js")
const reviewRouter =require("./routes/review.js")
const userRouter =require("./routes/user.js")


const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

//const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";


//MONGODB HOST URL

const dbUrl = process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.send("Hi, I am root");
});



//session define

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", () => {
  console.log("Error in MOngo session store", err);
});

const sessionOptions = {
  store, //mongo session define
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.curUser =req.user;
  next();
});

// app.get("/demouser", async (req, res) => {
//   let fakeuser = new User ({
//     emmail: "student@gmail.com",
//     username: "pankaj-kumar",
//   });

//   let registerUser = await User.register(fakeuser, "helloworld");
//   res.send(registerUser);
// });

// joi validation function define 
// const validationListing = (req, res, next) => {
//   let (error) = listingSchema.validate(req.body);
//   if(error) {
//     throw new ExpressError(400, resourceLimits.error);
//   }
//   else {
//     next();
//   }
// }




// wrap async function 
function asyncWrap(fn) {
  return function (req,res,next) {
      fn(req,res,next).catch((err) => next(err));
  };
}
///////////////

app.use("/listings", listingRouter);

app.use("/listings/:id/reviews" , reviewRouter);
app.use("/" , userRouter);
// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "My New Villa",
//     description: "By the beach",
//     price: 1200,
//     location: "Calangute, Goa",
//     country: "India",
//   });

//   await sampleListing.save();
//   console.log("sample was saved");
//   res.send("successful testing");
// });

// error handlig middleware


// app.use((err,req, next) => {
//   let { statusCode =500, message ="some error occured"} =err;
//   res.status(statusCode).send(message);
// });

app.all("*",(req, res, next) => {
  next(new ExpressError(404, "page not found!"));
});


app.use((err,req, res, next) => {
  let {statusCode =500, message = "Something went wrong!"} = err;
  //res.status(statusCode).send(message);
  res.status(statusCode).render("listings/error.ejs", {err});
  //res.send("something went wrong");
});

// function asynWrap(fn) {
//   return function (req,res, next) {
//     fn(req,res,next).catch((err) => next(err));
//   }
// }

// app.use((err, req, res, next) => {
//   res.send("someting went wrong");
// });

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});
