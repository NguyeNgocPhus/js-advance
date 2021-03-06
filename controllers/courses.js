const Course = require('../models/Course');
const asyncHandle = require('../middlewares/async');
const ErrorResponse = require('../utils/errorResponse');
const Bootcamp = require('../models/Bootcamp');

//@desc      GET all courses
//@route     GET /api/v1/courses
//@route     GET /api/v1/bootcamps/:bootcampId/courses
//@access    public

module.exports.getCourses = asyncHandle( async (req, res, next) => {
  if(req.params.bootcampId) {
    const courses = await Course.find({ bootcamp: req.params.bootcampId});

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

//@desc      GET single courses
//@route     GET /api/v1/courses/:courseId
//@access    public

module.exports.getCourse = asyncHandle( async (req, res, next) => {
  const course = await Course.findById(req.params.courseId).populate({
    path: 'bootcamp',
    select: 'name description'
  });

  if(!course) {
    return next(new ErrorResponse(`Course not found with id of ${req.params.courseId}`,404));
  }
  res.status(200).json({
    success: true,
    data: course
  });

});

//@desc      Add a course
//@route     POST /api/v1/bootcamps/:bootcampId/courses
//@access    public

module.exports.addCourse = asyncHandle( async (req, res, next) => {
  
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user.id;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if(!bootcamp) {
    return next( new ErrorResponse(`No bootcamp with id of ${req.params.bootcampId}`, 404));
  }

  if(bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to add a course to bootcamp id ${req.params.bootcampId}`, 401));
  }

  const course = await Course.create(req.body);

  res.status(201).json({
    success: true,
    data: course
  });
});

//@desc      Update a course
//@route     PUT /api/v1/courses/:courseId
//@access    private

module.exports.updateCourse = asyncHandle( async (req, res, next) => {
  let course = await Course.findById(req.params.courseId);

  if(!course) {
    return next( new ErrorResponse(`No course with id of ${req.params.courseId}`, 404));
  }

  if(course.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to add a course id ${course._id}`, 401));
  }

  course = await Course.findByIdAndUpdate(req.params.courseId, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: course
  });
});

//@desc      Delete a course
//@route     DELETE /api/v1/courses/:courseId
//@access    private

module.exports.deleteCourse = asyncHandle( async (req, res, next) => {
  const course = await Course.findById(req.params.courseId);

  if(!course) {
    return next( new ErrorResponse(`No course with id of ${req.params.courseId}`, 404));
  }

  if(course.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to add a course id ${course._id}`, 401));
  }

  course.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});