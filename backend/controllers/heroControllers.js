const Hero = require("../models/hero");

const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const APIFeatures = require("../utils/apiFeatures");

//Create a new Hero
exports.newHero = catchAsyncErrors(async (req, res, next) => {
  const hero = await Hero.create(req.body);

  res.status(201).json({
    success: true,
    hero,
  });
});

//Get All Heroes
exports.getHeroes = catchAsyncErrors(async (req, res, next) => {
  const resPerPage = 4;
  const heroCount = await Hero.countDocuments();

  const apiFeatures = new APIFeatures(Hero.find(), req.query)
    .search()
    .filter()
    .pagination(resPerPage);
  const heroes = await apiFeatures.query;

  res.status(200).json({
    success: true,
    count: heroes.length,
    heroCount,
    heroes,
  });
});

//Get a Single Hero
exports.getSingleHero = catchAsyncErrors(async (req, res, next) => {
  const hero = await Hero.findById(req.params.id);
  //if not successful
  if (!hero) {
    return next(new ErrorHandler("Hero not found", 404));
  }

  res.status(200).json({
    success: true,
    hero,
  });
});

//Update a single Hero
exports.updateHero = catchAsyncErrors(async (req, res, next) => {
  let hero = await Hero.findById(req.params.id);

  if (!hero) {
    return next(new ErrorHandler("Hero not found", 404));
  }

  hero = await Hero.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    hero,
  });
});

//Delete Hero
exports.deleteHero = catchAsyncErrors(async (req, res, next) => {
  const hero = await Hero.findById(req.params.id);
  if (!hero) {
    return next(new ErrorHandler("Hero not found", 404));
  }

  await hero.deleteOne();
  res.status(200).json({
    success: true,
    message: "Hero successfully deleted",
  });
});
