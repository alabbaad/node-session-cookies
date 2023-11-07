//import express 
const express = require('express')

//import express-session
const session = require('express-session')

//import session-file-store
const fileStore = require('session-file-store')(session)

//create server
const app = express()

//Create session
app.use(session({
    name: "session-tutorial",
    secret: "Neverdisclose",
    saveUninitialized: false, 
    resave: false, 
    store: new fileStore() 
}))

//Authorize User
function authUser(req, res, next){
    //Check session
    console.log(req.session)

    //confirming auth
    if(!req.session.user){
        let authHeader = req.headers.authorization;
        console.log(authHeader);//see what you are doing in terminal

        let error = new Error("You are not authenticated.");
        res.setHeader('WWW-Authenticate', "Basic");
        error.status = 401;

        next(error);

        var auth = new Buffer.from(authHeader.split(' ')[1], "base64").toString().split(":");

        //get username and password
        var username = auth[0];
        var password = auth[1];

        if (username == "happy" && password == "people"){
            req.session.user = "happy"
            next()
        }else{
            //try again if the provided credential is wrong
            var err = new Error('You are not authenticated!'); 
            res.setHeader("WWW-Authenticate", "Basic") 
            err.status = 401; 
            return next(err); 
        }
    }else{
        //if user is authenticated
        if (req.session.user === "happy"){
            next()
        }else{
            var err = new Error('Not authenticated!'); 
            res.setHeader("WWW-Authenticate", "Basic") 
            err.status = 401; 
            return next(err); 
        }
    }
}

app.use(authUser)
app.get('/', (req, res)=>{
    res.send("Welcome Happy people!")
})
app.get('/okay', (req, res)=>{
    res.send("This too work")
})
// Server setup 
app.listen(4000, () => { 
    console.log("Server is running on port 4000") 
})