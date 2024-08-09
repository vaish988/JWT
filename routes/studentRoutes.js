const express = require('express');
const router = express.Router();
const {
    register,
    login,
    
    getAllStudents,
    getStudent,
    updateStudent,
    getStudentsByDegree,
    displayUserDetails,
    postEducation,
    getEducation
} = require('../controllers/studentController'); 
const verifyToken = require('../middleware/authMiddleware'); 
const verifyRole = require('../middleware/verifyRole');

router.post('/register', register);
router.post('/login', login);

// router.post('/createUser', verifyToken, verifyRole('admin'), createUser);
router.get('/students', verifyToken, getAllStudents);
router.get('/students/:userId', verifyToken, getStudent);

router.get('/studentsByDegree', verifyToken, getStudentsByDegree);
router.get('/displayUserDetails', verifyToken, displayUserDetails);
router.post('/students/:userId/education', verifyToken, verifyRole('admin'), postEducation);
router.get('/students/:userId/education', verifyToken, getEducation);

module.exports = router;
