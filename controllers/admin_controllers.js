// auth requirements
var {google} = require('googleapis');
// Importing mongo student model
const Student = require('../models/student.js');
// importing vaccine model
const Vaccine = require('../models/vaccine.js').Vaccine;


// set pagination limit
const page_limit = 50;

// Handler for POST REQs submitting pdfs
const post_students = async ( req, res) => {

    // get page no
    const page = Number(req.body.page);
    // iterate through json to get filter specs
    var filters = req.body.filters;

    try{
        // return list of students
        var students = await Student.find(filters).skip((page - 1) * page_limit).limit(page_limit);
        var total_pages = students.length;
        // var students = students.skip(page * page_limit).limit(page_limit);
	console.log("	ADMIN PROVIDED STUDENTS LIST");
        res.status(200).json({
            "total_pages": total_pages,
            "data": students
        });
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            "error": err
        });
    }
}

// Handler for GET REQs on particular student
const get_student = async (req, res) => {

    // get id no
    const id = req.body._id;
    //console.log(id);
    try{
        var student = await Student.findById(id);
	console.log(" STUDENT DETAIL SENT IS : ");
	console.log(student);
	console.log("	ADMIN PROVIDED STUDENT DETAIL");
        res.status(200).json(student);
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            "error": err
        });
    }
}

// Handler for UPDATE REQs on a particular student
const update_student = async (req, res) => {

    // get  id no
    const id = req.body._id;
    console.log(" REQ ID PROVIDED IS : ");
    console.log(id);
    try{
        var updates = req.body.updates;
	console.log(" UPDATE FIELDS PROVIDED IS : ");
        console.log(updates);
        var student = await Student.findOneAndUpdate({_id: id}, updates, {new: true});
	console.log(" STUDENT POST UPDATION SENT IS : ");
        console.log(student);
	console.log("	ADMIN UPDATED STUDENT STATUS");
        res.status(200).json(student);
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            "error": err
        });
    }
}

// Handler for VIEW REQs of pdfs for student
// serving stored pdf file
const get_pdf = async (req, res) => {
    // get current logged in student
    try{
        // get downloaded file path
	var id = req.body._id;
	var student = Student.findById(id);
	if(student.pdf){
		var serve_file = student.pdf;
		console.log("\n		Serving PDF file at : ");
		console.log(String(serve_file)); 
		res.download(String(serve_file), function(err){
		    if(err){
			console.log(err);
			res.status(500).json({"error": "NO FILE FOUND ON SERVER"});
		    }
		    else{
			console.log("File served .");
		    }
        });
	}
	else{
		console.log("NO PDF FILE FOUND FOR STUDENT REQUESTED BY ADMIN");
		res.status(400).json({"error": "NO FILE FOUND ON SERVER"});
	}
    }
    // forward login errors
    catch(err){
        console.log(err);
        res.status(500).json({"error": err});
    }
}


//Handler for view requests of consent form by admin
// serving stored pdf file
const get_consent = async (req, res) => {
    // get current logged in student
    try{
        // get downloaded file path
	var id = req.body._id;
	var student = Student.findById(id);
	if(student.consent_form){
		var serve_file = student.consent_form;
		console.log("\n		Serving PDF file at : ");
		console.log(String(serve_file)); 
		res.download(String(serve_file), function(err){
		    if(err){
			console.log(err);
			res.status(500).json({"error": "NO FILE FOUND ON SERVER"});
		    }
		    else{
			console.log("File served .");
		    }
        });
	}
	else{
		console.log("NO PDF FILE FOUND FOR STUDENT REQUESTED BY ADMIN");
		res.status(400).json({"error": "NO FILE FOUND ON SERVER"});
	}
    }
    // forward login errors
    catch(err){
        console.log(err);
        res.status(500).json({"error": err});
    }
}


module.exports = {
    update_student,
    get_student,
    post_students,
    get_pdf,
    get_consent
}
