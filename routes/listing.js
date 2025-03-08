const express = require("express");
const router = express.Router();
const ExpressError = require("../utils/ExpressError.js");

const wrapAsync = require("../utils/asyncfuncation.js");
//const {listingSchema} = require("./schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn , isOwner} = require("../middleware.js");
const listingController = require("../controllers/listings.js");

const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });


// wrap async function 
function asyncWrap(fn) {
  return function (req,res,next) {
      fn(req,res,next).catch((err) => next(err));
  };
}
///////////////


//Index Route
router.get("/", asyncWrap (listingController.index));
  
  //New Route
router.get("/new", isLoggedIn, listingController.rendernewform);

  //Show Route
router.get("/:id", asyncWrap (listingController.showlisting));
  
  //Create Route
router.post("/", isLoggedIn, upload.single("listing[image]"), wrapAsync ( listingController.creacteListing));


//image uploading testing programs
// router.post( "/",upload.single("listing[image]"),(req,res) => {
//   res.send(req.file);
// });


  
  //Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, asyncWrap ( listingController.renderEditForm));
  
  //Update Route
router.put("/:id", isLoggedIn,isOwner,upload.single("listing[image]"),  asyncWrap ( listingController.Updatelisting));
  
  //Delete Route
router.delete("/:id", isLoggedIn, isOwner, asyncWrap ( listingController.deletelisting));

module.exports = router;
  