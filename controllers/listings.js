const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  }


module.exports.rendernewform = (req, res) => {
    //throw new ExpressError(404, "page not fuond");
    res.render("listings/new.ejs");
  };
  
module.exports.showlisting = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({
      path:"reviews",
      populate:{ 
        path: "author",
      },
      })
      .populate("owner");

    if(!listing) {
      req.flash("error", "Listing You Requested for does not exits");
      res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
  };  


module.exports.creacteListing = async (req, res, next) => {
    // let result = listingSchema.validate(req.body);
    // console.log(result);

    let url = req.file.path;
    let filename = req.file.filename;
     //console.log(url,"..", filename);
  
    // if(!req.body.listing) {
    //   next(new ExpressError(400, "Send valid data for listing"));
    // }
    const newListing = new Listing(req.body.listing);
      //console.log(req.user._id);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    await newListing.save();
    req.flash("success","New Listing Created Succesfully");
    res.redirect("/listings");
  };   

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
      req.flash("error", "Listing You Requested for does not exits");
      res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs", { listing,originalImageUrl });
  };  

module.exports.Updatelisting = async (req, res) => {
    // if(!req.body.listing) {
    //   next(new ExpressError(400, "Send valid data for listing"));
    // }
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    
    if(typeof req.file !=="undefined"){ //uploading image data 
    let url = req.file.path;
    let filename = req.file.filename; 
    listing.image = { url,filename};
    await listing.save();
  }
    req.flash("success","Listing Updated Succesfully");
    res.redirect(`/listings/${id}`);
  };

module.exports.deletelisting = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Deleted Succesfully");
    res.redirect("/listings");
  };  