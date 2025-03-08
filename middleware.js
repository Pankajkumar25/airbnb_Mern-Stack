const Listing = require("./models/listing");
const Review = require("./models/review");
module.exports.isLoggedIn = (req, res,next) => {
    console.log(req.user);
    if(!req.isAuthenticated()) {
        req.session.redirectUrl =req.originalUrl;
        req.flash("error", "You Must be Logged in to Create Listing !");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl=(req,res,next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;

    }
    next();
}


module.exports.isOwner = async (req,res,next) => {
    let{id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.curUser._id)) {
      req.flash("error","You are not the owner o this listings");
      return res.redirect(`/listings/${id}`);
    }
    next();
}


module.exports.isReviewAuthor = async (req,res,next) => {
    let{id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.curUser._id)) {
      req.flash("error","You are not the Author of this Review ");
     return res.redirect(`/listings/${id}`);
    }
    next();
}