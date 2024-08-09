const express = require('express');
const app = express();
const mongoose = require('mongoose');
//const dotenv = require('dotenv');
const studentRoutes = require('./routes/studentRoutes'); // Correct path
const protectedRoute = require('./routes/protectedroute'); // Correct path

//dotenv.config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/JWTStudents', { useNewUrlParser: true, useUnifiedTopology: true,ssl:false})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

app.use(express.json());

app.use('/', studentRoutes);
app.use('/', protectedRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
