const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const verifyRole=require('../middleware/verifyRole')
const createUser=require('../controllers/studentController')

// Protected route
router.get('/', verifyToken, (req, res) => {
    res.status(200).json({ message: 'Protected route accessed' });
});

// router.post('/createUser', verifyToken, verifyRole('admin'), createUser);
router.get('/admin-only', verifyToken, verifyRole('admin'), (req, res) => {
    res.status(200).json({ message: 'Admin-only route accessed', userId: req.userId, role: req.userRole });
});

// Protected route for users with a specific role
router.get('/user-data', verifyToken, verifyRole('student'), (req, res) => {
    res.status(200).json({ message: 'User data accessed', userId: req.userId, role: req.userRole });
});
router.post('/createUser', verifyToken, verifyRole('student'), (req,res)=>{
    res.status(200).json({message:'user created'});
});


router.get('/students', verifyToken, verifyRole('userRole'), async (req, res) => {
    try {
        const students = await Student.find(); // Assuming you have a Student model
        res.status(200).json({
            message: 'students data accessed',
            userId: req.userId,
            role: req.userRole,
            students: students
        });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving students data', error: error.message });
    }
});

router.get('/students/:userId',verifyToken,verifyRole('userRole'),async(res,req) =>{
    try{
        const students = await Student.find({ userId: req.params.userId });
     res.status(200).json({
        message:'students Data accessed',
        userId:req.userId,
        role:req.userRole,
        students:students
     });
} catch(err){
    res.status(500).json({message:"Error"})
}
});


router.put('/students/:id', verifyToken, verifyRole('student'),(req,res) =>{
    res.status(200).json({message:'student updated'});

});




module.exports = router;
