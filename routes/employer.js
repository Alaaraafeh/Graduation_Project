const express = require('express');
const employerController = require('../controllers/employer');
const employerModel = require('../models/employer')
const isAuth = require('../middleware/is-auth');
const { body } = require("express-validator");


const router = express.Router();

router.get("/Registration", employerController.getNewUser)

router.post('/Registration', [
    // Validation for first name
    body('firstName')
        .trim()
        .not().isEmpty().withMessage('First name is required'),

    // Validation for last name
    body('lastName')
        .trim()
        .not().isEmpty().withMessage('Last name is required'),

    // Validation for mobile number
    body('mobileNumber')
        .trim()
        .not().isEmpty().withMessage('Mobile number is required')
        .isNumeric().withMessage('Mobile number must be numeric')
        .isLength({ min: 10 }).withMessage('Mobile number must be at least 10 digits'),
    body('email')
        .not().isEmpty()
        .withMessage('please enter a valid email.')
        .isEmail()
        .withMessage('Invalid email address')
        .normalizeEmail()
        .custom( async (email) => {
            const findUser = await employerModel.findOne({email: email})
            if (findUser) {
                throw new Error('user already exists!')
            }
            return true
        }), 
    body('confirmEmail').normalizeEmail().custom((value ,{ req }) => {
    if (value !== req.body.email){
    throw new Error('email do not match');
    }
    return true;
}),
body('password').isLength({min: 5}).withMessage('Invalid password').trim(),
body('confirmPassword').trim().custom((value, { req }) => {
    if (value !== req.body.password){
    throw new Error('password do not match');
    }
    return true;
})], 
employerController.postAddUser);

// post jobs
router.get("/posts", isAuth, employerController.getPosts)

router.post("/post", [
    body("jobName").isLength({min: 3}),
    body("companyName").isLength({min: 2}),
    body("jobDescription").isLength({min: 20}).withMessage("the descreption is to short, pleace give mor ditails"),
    body("jobRequirement").isLength({min: 2}),
], employerController.createPost)



module.exports = router; 