const Students = require('../models/student');
const Personal = require('../models/personal');
const Educational = require('../models/educational');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { name, email, password, mobile, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new Students({ name, email, password: hashedPassword, mobile, role });
        await user.save();
        res.status(201).json({ message: "Registered successfully" });
    } catch (error) {
        res.status(400).json({ message: "Registration unsuccessful", error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Students.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Authentication failed' });
        }
        const token = jwt.sign({ userId: user._id ,role:user.role}, 'your-secret-key', { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Login failed', details: error.message });
    }
};

exports.createUser = async (req, res) => {
    

    console.log("Starting user creation process...");

    try {
        // Create user detailsy
        const { student, personal, educational } = req.body;
        console.log("Creating student record...");
        const stud = new Students({
            name: student.name,
            email: student.email,
            password: student.password, // Ensure password is hashed in production
            mobile: student.mobile,
            role: student.role
        });
        await stud.save();
        console.log('Student created:', stud);

        // Add personal details
        console.log('Creating personal details...');
        const pers = new Personal({
            address: {
                doorno: personal.address.doorno,
                street: personal.address.street,
                city: personal.address.city,
                pin: personal.address.pin
            },
            biodata: {
                name: personal.biodata.name,
                dob: personal.biodata.dob,
                gender: personal.biodata.gender,
                native: personal.biodata.native
            },
            student: stud._id
        });
        await pers.save();
        console.log("Personal details created:", pers);

        // Link personal details to student
        stud.personaldet = pers._id;
        await stud.save();
        console.log("Student updated with personal details", stud);

        // Add educational details
        console.log("Creating educational details...");
        const edu = new Educational({
            current: educational.current,
            education: {
                level: educational.education.level,
                institute: {
                    name: educational.education.institute.name,
                    location: educational.education.institute.location
                },
                marks: educational.education.marks
            },
            student: stud._id
        });
        await edu.save();
        console.log("Educational details created:", edu);

        // Link educational details to student
        stud.educationaldet.push(edu._id);
        await stud.save();
        console.log("Student updated with educational details", stud);

        // Display success message
        res.status(201).json({
            message: "User created with personal and educational data",
            user: stud,
            personal_details: pers,
            educational_details: edu
        });
    } catch (error) {
        console.error("Error in creation:", error.message); // Log the exact error message
        res.status(500).json({ error: "Failed to create user" });
    }
};
   
exports.getEducation = async (req, res) => {
    try {
        const { userId } = req.params;
        const student = await Students.findById(userId).populate('educationaldet').lean();
        if (!student) {
            return res.status(404).send({ message: "Student Not found" });
        }
        student.educationaldet.forEach(item => {
            delete item.student;
            delete item.__v;
        });
        res.send(student);
    } catch (error) {
        res.status(500).send({ message: "Server error", error: error.message });
    }
};

exports.postEducation = async (req, res) => {
    try {
        const { userId } = req.params;
        const { educational } = req.body;

        const user = await Students.findById(userId);
        if (!user) {
            return res.status(404).send({ message: "Student Not found" });
        }

        const edu = new Educational({ ...educational, student: user._id });
        await edu.save();
        user.educationaldet.push(edu._id);
        await user.save();

        res.status(201).send({ message: "Education Added", user });
    } catch (error) {
        res.status(500).send({ message: "Server Error", error: error.message });
    }
};

exports.getAllStudents = async (req, res) => {
    try {
        const students = await Students.find({}).populate('personaldet educationaldet');
        if (students.length === 0) {
            return res.status(404).send({ message: "No Students found" });
        }
        res.status(200).send({ message: "All student details fetched successfully", students });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error", error: error.message });
    }
};

exports.getStudent = async (req, res) => {
    try {
        const { userId } = req.params;
        const student = await Students.findById(userId).populate('personaldet educationaldet').lean();
        if (!student) {
            return res.status(404).send({ message: "Student Not found" });
        }
        student.educationaldet.forEach(item => {
            delete item.student;
            delete item.__v;
        });
        delete student.personaldet.student;
        delete student.personaldet.__v;
        res.status(200).send({ message: "Student details fetched", student });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error", error: error.message });
    }
};

exports.updateStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedStudent = await Students.findByIdAndUpdate(id, req.body.student, { new: true, runValidators: true });
        if (!updatedStudent) {
            return res.status(404).send({ message: 'Student not found' });
        }
        res.status(200).send({ message: "Student updated", student: updatedStudent });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error", error: error.message });
    }
};

exports.getStudentsByDegree = async (req, res) => {
    try {
        const { current } = req.query;
        const students = await Students.find().populate({
            path: 'educationaldet',
            match: { current }
        }).lean();
        const result = students.filter(student => student.educationaldet.length > 0);
        res.status(200).json({
            message: "Students with specified degree fetched successfully",
            students: result
        });
    } catch (error) {
        res.status(500).json({
            message: 'An error occurred while fetching students with the specified degree',
            error: error.message
        });
    }
};

exports.displayUserDetails = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await Students.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
