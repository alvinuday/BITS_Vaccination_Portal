const check_auth = async (req, res, next) => {
    if(req.session["student"]){
        next();
    }
    else{
        res.status(400).json({"error": "Student has not logged in yet"});
        res.end();
    }
}


module.exports = check_auth;