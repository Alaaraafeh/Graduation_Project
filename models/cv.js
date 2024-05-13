const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cvSchema = new Schema({
    jobTitle: {
        type: String,
        required: true
    },
    jobLocation: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
    },
    country: {
        type: String,
    },
    nationalty: {
        type: String,
    },
    date: {
        type: String,
    },
    personalStatement: {
        name: {
            type: String,
            required: true
        }
    },
    employmentHistory:{
        name: {
            type: String,
            required: true
        }
    },
    education: {
        name: {
            type: String,
            required: true
        }
    },
    languages: {
        name: {
            type: String,
            required: true
        }
    },
    certifications: {
        name: {
            type: String,
            required: true
        }
    },
    awards: {
        name: {
            type: String,
            required: true
        }
    },
    links: {
        name: {
            type: String,
            required: true
        }
    },
    interests: {
        name: {
            type: String,
            required: true
        }
    },
    skills: {
        name: {
            type: String,
            required: true
        }
    }
}, { timestamps: true });

module.exports = mongoose.model('Cv', cvSchema);
