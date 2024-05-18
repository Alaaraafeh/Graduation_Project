const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const axios = require('axios');

const jopseekerRouter = require('./routes/jopseeker');
const employerRouter = require('./routes/employer')
const userRouter = require('./routes/user-auth')

const app = express();


app.use(bodyParser.json());
//app.use(cors());
app.use('/images', express.static(path.join(__dirname, 'images')));


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Methods',
        'options, get, post, put, patch, delete'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/jobseeker', jopseekerRouter);
app.use('/employer', employerRouter);
app.use('/user', userRouter);


app.post('/upload-cv', async (req, res) => {
    try {
        const response = await axios.post('http://127.0.0.1:5000/upload-cv', req.body, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        res.send(response.data);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.post('/generate_text', async (req, res) => {
    try {
        const response = await axios.post('http://127.0.0.1:5000/generate_text', req.body, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        res.send(response.data);
    } catch (error) {
        res.status(500).send(error.message);
    }
});


//general error handle function 3 after all my routes
//this will be exe when an error is thrown
app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500; //if it undifend it will by defoult 500
    const message = error.message || 'Internal Server Error'; // this existes by defulet in the Error object 
    const data = error.data || [];
    res.status(status).json({ message: message, data: data}); 
});

mongoose.connect('mongodb+srv://alaaraafeh:0n2tZjKrUSz3sznE@cluster0.fwbw8sv.mongodb.net/mongodb')
.then(()=> {
    app.listen(8080)
    console.log("Connected to Database");
}).catch( err => {
    console.log(err)
})
        

