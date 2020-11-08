var express = require('express');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var app = express();
app.set("view engine","ejs");
var nodemailer = require('nodemailer');
app.set("view engine","ejs");
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));

var email;
var db;

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

MongoClient.connect("mongodb+srv://admindb:admindatabase@cluster0-vlwic.mongodb.net/test",{useUnifiedTopology:true,useNewUrlParser:true},(err,database)=>{
    if(err) console.log(err)
    else{
        db = database.db('hackcbs');
    }
});

app.get('/',(req,res)=>{
  res.render('home');
});
app.get('/index',(req,res)=>{
  res.render('index');
});

//SIGN UP
app.get('/signup',(req,res)=>{
  res.render('signup');
});

app.post('/signup',(req,res)=>{
  db.collection('users').insertOne(req.body.user,(err,result)=>{
    if(err) res.json(err);
    else{
      console.log('signup success');
      res.redirect(`/welcome/${result.name}`);
    }
  })
});

//LOGIN
app.get('/login',(req,res)=>{
  res.render('login');
});
app.post('/login',(req,res)=>{
  db.collection('users').findOne({email:req.body.user.email,pass:req.body.user.pass},(err,result)=>{
    if(err) res.json(err)
    else if(!result){
      console.log("WRONG CREDS");
      res.redirect('/login')
    }
    else{
      console.log('login success');
      res.redirect(`/welcome/${result.name}`);
    }
  })
});

//homePage after login
app.get('/welcome/:name',(req,res)=>{
  const d = req.params.name;
  db.collection('users').findOne({name:d},(err,result)=>{
    if(err) console.log(err)
    else if(!result){
      console.log("LOGIN AGAIN!");
      res.redirect('/login');
    }
    else{
      res.render("home2",{users:result});
      console.log(result);
    }
  })
});

//profile after login
app.get('/profile/:name',(req,res)=>{
  const d = req.params.name;
  db.collection('users').findOne({name:d},(err,result)=>{
    if(err) console.log(err)
    else if(!result){
      console.log("LOGIN AGAIN!");
      res.redirect('/login');
    }
    else{
      res.render("profile",{users:result});
      console.log(result);
    }
  })
});

//get appointments form after login
app.get('/forms/:name',(req,res)=>{
  const d = req.params.name;
  db.collection('users').findOne({name:d},(err,result)=>{
    if(err) console.log(err)
    else if(!result){
      console.log("LOGIN AGAIN!");
      res.redirect('/login');
    }
    else{
      res.render("index2",{users:result});
      console.log(result);
    }
  })
});

//get appointments after login
app.get('/appointments/:name',(req,res)=>{
  db.collection('appointment').find({name:req.params.name}).toArray((err,result)=>{
      if(err) res.json(err)
      else{
          //res.json(result);
          res.render('appointment',{users:result});
      }
  })
});

//post appointments after login
app.post('/appointment/:name',(req,res)=>{
  var N = req.body.user.name
  req.body.user.name = req.params.name;
  db.collection('appointment').insertOne(req.body.user,(err,result)=>{
    if(err) console.log(err);
    else if(!result){
      console.log("SIGNUP PLS!");
      res.redirect('/signup');
    }
    else{
      console.log('appointment success');
      console.log(result.name);
      res.redirect('back');
    }
  })
});

//subscribe button
app.post('/posting',(req,res)=>{
    email = req.body.user.email;
    console.log(email);
    db.collection('emails').insertOne(req.body.user,(err,result)=>{
        if(err) res.json(err)
        else{
            //res.json(result);
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: 'slingersweb0@gmail.com',
                  pass: 'Web$slingers007'
                }
              });
              
              var mailOptions = {
                from: 'slingersweb0@gmail.com',
                to: email,
                subject: 'Thanks for subscribing us!',
                text: `You will now recieve latest news realted to Health Care!!`
              };
              
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });
            res.redirect('/');
        }
    })
})

const port = process.env.PORT || 3000;
app.listen(port, ()=> console.log(`Listening at port ${port}!`));