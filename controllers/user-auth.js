const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Jopseeker = require("../models/jopseeker");
const Employer = require("../models/employer");
const { validationResult } = require('express-validator');

// log in logic 
exports.logIn = async (req, res, next) => {
    try {
        const { email , password } = req.body


        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg);
            return res.status(422).json({ errors: errorMessages });
        }

        const findUser1 = await Jopseeker.findOne({ email });
        const findUser2 = await Employer.findOne({ email });

        let user;
        if (findUser1) {
            user = findUser1;
        } else if (findUser2) {
            user = findUser2;
        }

        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 401; // not found
            throw error;
        };
        const passwordMatch = await bcrypt.compare(password, user.password);
    
        
        if (!passwordMatch ) {
            const error = new Error('Wrong email or password');
            error.statusCode = 401;
            throw error;
        }
        
        const token = jwt.sign({ email: user.email, userId: user._id.toString() }, "tokensecret", { expiresIn: '24h' }); // security
        
        return res.status(200).json({ token: token, message: 'Logged in successfully' });

    } catch (err) {
        console.log(err); // Log the error for debugging purposes

    if (err.statusCode === 401) {
        // If it's a 401 error, return the specific error message
        return res.status(401).json({ message: err.message });
    } else {
        // If it's not a 401 error, return a generic error message
        return res.status(500).json({ message: 'Something went wrong. Please try again later.' });
    }
    }
};

exports.authenticateUser = (req, res, next) => {
    const token = req.headers.authorization; // Assuming token is sent in the Authorization header

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decodedToken = jwt.verify(token, "tokensecret");
        req.userData = decodedToken;
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token or token expired' });
    }
};
