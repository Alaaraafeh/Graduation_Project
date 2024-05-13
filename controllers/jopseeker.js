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
        jobLocation: req.body.jobLocation,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        address: req.body.address,
        city: req.body.city,
        country: req.body.country,
        nationalty: req.body.nationalty,
        date: req.body.date,
        personalStatement: req.body.personalStatement,
        employmentHistory: req.body.employmentHistory,
        education: req.body.education,
        languages: req.body.languages,
        certifications: req.body.certifications,
        awards: req.body.awards,
        links: req.body.links,
        interests: req.body.interests,
        skills: req.body.skills
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

/*
exports.editCv = async (req, res, next) => {
    const cvId = req.params.cvId;

   if (!errors.isEmpty()) {
        const error = new Error('Validation failed, the data is incorrect');
        error.statusCode = 422;
        console.log(errors.array()); // Log the validation errors
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
        findCv.companyName = req.body.companyName;
        findCv.companyMail = req.body.companyMail;
        findCv.jobDescription = req.body.jobDescription;
        findCv.category = req.body.category;
        findCv.jobType = req.body.jobType;
        findCv.imageUrl = result.data;
        findCv.salary = req.body.salary;
        findCv.currency = req.body.currency;
        findCv.timePeriod = req.body.timePeriod;
        findCv.companyWebsite = req.body.companyWebsite;
        findCv.companyInfo = req.body.companyInfo;

        const updatedCv = await findCv.save();

        res.status(200).json({ message: 'Cv updated.', updatedCv });
    } catch (err) {
        next(err);
    }
};

*/
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