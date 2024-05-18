const bcrypt = require('bcrypt');
const Jopseeker = require("../models/jopseeker");
const { validationResult } = require('express-validator');
const Cv = require("../models/cv");


exports.getNewUser = async (req, res, next) => {
    res.status(200).json({ page: "jopseeker registration page"})
};

exports.postAddUser = async (req, res, next) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const confirmEmail = req.body.confirmEmail;
    const mobileNumber = req.body.mobileNumber;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const disability = req.body.disability;

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors.array());
        const errorMessages = errors.array().map(error => error.msg);
        return res.status(422).json({ errors: errorMessages });
    }


    // validation
    if (!firstName || !lastName || !email || !confirmEmail || !mobileNumber || !password || !confirmPassword) {
        return res.status(400).send("Missing required data");
    }

    // regestration logic
    try {
        const hashPassword = await bcrypt.hash(password, 10);
        const hashConfirmPassword = await bcrypt.hash(confirmPassword, 10);
        const user = new Jopseeker({
            firstName: firstName,
            lastName: lastName,
            email: email,
            confirmEmail: confirmEmail,
            mobileNumber: mobileNumber,
            password: hashPassword,
            confirmPassword: hashConfirmPassword,
            disability: disability
        });
        await user.save()
        res.status(201).json({massage: 'jopseeker user added successfuly', userId: user._id});
        // fornt i think  res.redirect('/Home');

    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong. Please try again later.");
    }
};



exports.createCv = async (req, res, next) => {
    const errors = validationResult(req);
   if (!errors.isEmpty()) {
        const error = new Error('Validation failed, the data is incorrect')
        error.statusCode = 422;
        throw error;
    }

    const cv = new Cv({
        jobTitle: req.body.jobTitle,
        location: req.body.location,
        email: req.body.email,
        personalStatement: req.body.personalStatement,
        employmentHistory: req.body.employmentHistory,
        education: req.body.education,
        languages: req.body.languages,
        certifications: req.body.certifications,
        links: req.body.links,
        skills: req.body.skills,
        strength: req.body.strength
    })
    try {
        await cv.save()
        res.status(201).json({
            message: "CV created successfully!",
            cv: cv
        })
    } catch (err) {
        next(err);
    }
}


exports.editCv = async (req, res, next) => {
    const cvId = req.params.cvId
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
         const error = new Error('Validation failed, the data is incorrect')
         error.statusCode = 422;
         throw error;
    }
    try {
        const findCv = await Cv.findById(cvId);
        if (!findCv) {
            const error = new Error("not find Cv.");
            error.statusCode = 404;
            throw error;
        }
        findCv.jobTitle = req.body.jobTitle;
        findCv.jobLocation = req.body.jobLocation;
        findCv.email = req.body.email;
        findCv.phoneNumber = req.body.phoneNumber;
        findCv.address = req.body.address;
        findCv.city = req.body.city;
        findCv.country = req.body.country;
        findCv.nationalty = req.body.nationalty;
        findCv.date = req.body.date;
        findCv.personalStatement = req.body.personalStatement;
        findCv.employmentHistory = req.body.employmentHistory;
        findCv.education = req.body.education;
        findCv.languages = req.body.languages;
        findCv.certifications = req.body.certifications;
        findCv.awards = req.body.awards;
        findCv.links = req.body.links;
        findCv.interests = req.body.interests;
        findCv.skills = req.body.skills;

        const updatedCv = await findCv.save();

        res.status(200).json({ message: 'Cv updated.', updatedCv });
    } catch (err) {
        next(err);
    }
};


exports.getCv = async (req, res, next) => {
    const cvId = req.params.cvId;
    try {
        const findCv = await Cv.findById(cvId);
        if (!findCv) {
            const error = new Error("not find cv.");
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ message: 'cv fetched.', post: findCv });
    } catch (err) {
        next(err);
    }
}


exports.deleteCv = async(req, res, next) => {
    const cvId = req.params.cvId;
    try{
        const findCv = await Cv.findById(cvId)
        if (!findCv) {
            const error = new Error("not find Cv");
            error.statusCode = 404;
            throw error;
        }
        await Cv.findByIdAndDelete(cvId);
        res.status(200).json({massage: "Deleted Cv."})
    } catch (err) {
        next(err)
    }

}