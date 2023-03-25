const express = require("express");
const router = express.Router();
const WrapAsync = require("../Utils/WrapAsync");
const campgrounds = require("../connectors/campgrounds");
const {
  isLoggedIn,
  isAuthor,
  ValidateData,
} = require("../middleware");
const multer = require("multer");
const { storage } = require("../Cloudinary");
const upload = multer({ storage });

//Index page to display all the campgrounds
router.get(
  "/",
  isLoggedIn,
  WrapAsync(campgrounds.campgroundIndex)
);

// To create new Campground
router.get(
  "/new",
  isLoggedIn,
  campgrounds.renderNewForm
);
router.post(
  "/",
  isLoggedIn,
  ValidateData,
  upload.array("image"),
  WrapAsync(campgrounds.createCampground)
);

// To display details of specific Campground
router.get(
  "/:id",
  WrapAsync(campgrounds.showCampground)
);

// To edit or Update Campground details
router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  WrapAsync(campgrounds.renderEditForm)
);
router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  upload.array("image"),
  ValidateData,
  WrapAsync(campgrounds.updateCampground)
);

// To delete a Campground
router.delete(
  "/:id",
  isLoggedIn,
  isAuthor,
  WrapAsync(campgrounds.deleteCampground)
);

module.exports = router;
