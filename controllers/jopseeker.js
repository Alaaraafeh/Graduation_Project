const bcrypt = require('bcrypt');
const Jopseeker = require("../models/jopseeker");
const { validationResult } = require('express-validator');
// function that grap all the errors get from check middelware


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






// exports.postFindUser = async (req, res, next) => {
//     // log in logic 
//     try {
//         const {email , password} = req.body;
//         const findUser = await Jopseeker.findOne({ email });
//         // hashed the input normal password and compare it with the hashed saved password in DB
//         const passwordMath = await bcrypt.compare(password, findUser.password);

//         if(findUser && passwordMath) {
//             return res.json({ message : 'Logged in successfully'});
//         }
//         res.status(400).send('Wrong email or password');

//     } catch (err) {
//         res.status(500).send("Something went wrong. Please try again later.");
//     }
// };


//edit

//update

//delete

// app.post('/user/:id', (req, res)=> {
//     const id = req.params;
//     const name = req.body.name;
//     const rule = req.body.rule;
//     res.send({
//     userId : id,
//     name: name,
//     rule: rule})
// })