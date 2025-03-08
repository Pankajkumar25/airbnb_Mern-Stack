const express = require("express");
const router = express.Router({mergeParams: true});
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/asyncfuncation.js");
const Listing = require("../models/listing.js");
//const Listing = require("./models/listing.js");
const Review = require("../models/review.js");
const { isLoggedIn,isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");

//add review routs
router.post("/",isLoggedIn, reviewController.createReview );
    
// delete reviews route    
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.DeleteReview));
    
    module.exports = router;