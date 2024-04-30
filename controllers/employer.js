const bcrypt = require('bcrypt');
const Employer = require("../models/employer");
const Post = require("../models/post");
const { validationResult } = require('express-validator');


exports.getNewUser = async (req, res, next) => {
    res.status(200).json({ page: "employer registration page"})
};


//registration
exports.postAddUser = async (req, res, next) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const confirmEmail = req.body.confirmEmail;
    const mobileNumber = req.body.mobileNumber;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors.array());
        //const errorMessages = errors.array().map(error => error.msg);
        return res.status(422).json({ message:'Validation failed', errors: errors.array() });
    }

    if(email !== confirmEmail){
        const error =new Error('Email and confirmEmail do not match.');
        error.statusCode = 422;
        //error.data = errors.array();
        throw error;
    }

    // regestration logic
    try {
        const hashPassword = await bcrypt.hash(password, 10);
        const hashConfirmPassword = await bcrypt.hash(confirmPassword, 10);
        const user = new Employer({
            firstName: firstName,
            lastName: lastName,
            email: email,
            confirmEmail: confirmEmail,
            mobileNumber: mobileNumber,
            password: hashPassword,
            confirmPassword: hashConfirmPassword,
        });
    
        await user.save()
        res.status(201).json({massage: 'employer user added successfuly'});
        // res.redirect('/Home')
    } catch (err) {
        res.status(500).send("Something went wrong. Please try again later.");
    }
};


// post jops
exports.getPosts = async (req, res, next) => {
    try{
        const allPosts = await Post.find();
        if ( allPosts.length > 0){
            return res.status(200).json({
                posts: allPosts
            });
        } else {
            return res.status(200).json({
                message: "No posts found"
            });
        }
    } catch (error) {
        console.error("Error fetching posts:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}


exports.createPost = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, the data is incorrect')
        error.statusCode = 422; // adding own custume property 
        return next(error);  // it will exist the fuction exe here and access the error handel function or middelware in the app
    }

    const { jobTitle, jobLocation, companyName, 
        companyMail, jobDescription, category,
        jobType, salary, currency, timePeriod, 
        companyWebsite, companyInfo, imageUrl } = req.body;
    
    const post = new Post({
        jobTitle : jobTitle,
        jobLocation: jobLocation,
        companyName: companyName,
        companyMail: companyMail,
        jobDescription: jobDescription,
        category: category,
        jobType: jobType,
        imageUrl: imageUrl,
        salary: salary,
        currency: currency,
        timePeriod: timePeriod,
        companyWebsite: companyWebsite,
        companyInfo: companyInfo,
        creator: {name: "alaa"}
    })
    try {
        await post.save()
        res.status(201).json({
            message: "Post created successfully!",
            post: post
        })
    }catch (err) {
        next(err);
    }

}


//edit

//update

//delete