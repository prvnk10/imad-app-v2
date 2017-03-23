var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var crypto = require('crypto');
var bodyParser = require('body-parser');
var session = require('express-session');


var config = {
    user: 'prvnk10',
    database: 'prvnk10',
    host: 'db.imad.hasura-app.io',
    port: '5432',
    password: process.env.DB_PASSWORD
};

var app = express();
app.use(morgan('combined'));

app.use(bodyParser.json());

app.use(session({
    secret: 'someRandomSecretValue',
    cookie: {maxAge: 1000*60*60*24*30}
}));

var articles = {
  'article-one': { title: 'Article One', heading : 'Article One', date : 'Feb 4, 2017', content: `

  <p> this is the first paragraph </p>
  <p> this is the first paragraph </p>
  <p> this is the first paragraph </p>
  
  `
  },
  'article-two': {'title': 'Article Two', 'heading' : 'Article Two', 'date' : 'Feb 11, 2017', 'content': `
  <p> this is the second paragraph </p>
  <p> this is the second paragraph </p>
  <p> this is the second paragraph </p>
  
  `},
  'article-three' : {title: 'Article Three', heading : 'Article Three', date : 'Feb 4, 2017', content: `
  <p> this is the third paragraph </p>
  <p> this is the third paragraph </p>
  <p> this is the third paragraph </p>
  
  `}
};

function createTemplate(data){
  var title = data.title;
  var heading = data.heading;
  var date = data.date;
  var content = data.content;
  
  var htmlTemplate = `
    <html>
    <head> 
    
    <script type='text/javascript' src='/ui/main.js'> </script>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <title> ${title} </title> 
    </head>
    
    <body>

    <nav class="navbar navbar-default">
     <div class="container-fluid">
     
      <div class="navbar-header">
       <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span> 
       </button>
       <a class="navbar-brand" href="/"> Home </a>
      </div>

    <div class="collapse navbar-collapse" id="myNavbar"> 
     <ul class="nav navbar-nav">
      <li> <a href="/articles/article-one"> Article 1 </a> </li>
      <li> <a href="/articles/article-two"> Article 2 </a> </li> 
      <li> <a href="/articles/article-three"> Article 3 </a> </li> 
     </ul>
    </div>
  </nav>
    
    <div class="alert alert-info">
    <h3> ${heading} </h3>
    <div> ${date.toDateString()} </div>
    </div>
    
    <div class="alert alert-warning"> ${content} </div>
    
    <div col-sm-offset-2 col-sm-10>
     <input type='text' id='comment'>
     <input type='submit' name='submit' value='submit' id='submit_btn' onclick="submitComment()">
     <span id='showComments'> <ul> </ul> </span>
    </div>
    
    </body>
    </html>
  `;
  
  return htmlTemplate;
}

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

app.get('/login' , function(req,res){
   res.sendFile(path.join(__dirname, 'ui', 'login.html')); 
});

function hash(input, salt){
    var hashed = crypto.pbkdf2Sync(input, salt, 10000, 512, 'sha512');
    return ['pbkdf2Sync', '10000', salt, hashed.toString('hex')].join('$');
}

app.get('/hash/:input', function(req,res){
   var hashedString = hash(req.params.input, 'this-is-some-random-string');
   res.send(hashedString);
});

var pool = new Pool(config);
app.post('/create-user', function(req,res){
    var username = req.body.username;
    var password = req.body.password;
    
    var salt = crypto.randomBytes(128).toString('hex');
    var dbString = hash(password, salt);
    
    pool.query('INSERT INTO "users"(username, password) VALUES ($1, $2)' , [username, dbString], function(err, result){
       
       if(err)
       {
           res.status(500).send(err.toString());
       }
       else
       {
           res.send('User successfully created ' + username);
       }
    });
});

app.post('/login', function(req,res){
   var username = req.body.username;
   var password = req.body.password;
   
   pool.query('SELECT * FROM "users" WHERE username=$1', [username], function(err,result){
      if(err)
      {
          res.status(500).send(err.toString());
      }
      else
      {
          if(result.rows.length === 0)
          {
              res.send(403).send('username/password is invalid');
          }
          else
          {
              // match the password
              var dbString = result.rows[0].password;
              var salt = dbString.split('$')[2];
              
              var hashedPassword = hash(password, salt);
              if(hashedPassword === dbString)
              {
                  // set session
                  req.session.auth = {userId: result.rows[0].id};
                  res.send("successfully logged in!");
              }
              else
              {
                  res.send(403).send('username/password is invalid');
              }
          }
      }
   });
});

app.get('/check-login', function(req,res){
  if (req.session && req.session.auth && req.session.auth.userId) {
    
    pool.query('SELECT * FROM "user" WHERE id = $1', [req.session.auth.userId], function (err,result) {
           if (err)
           {
              res.status(500).send(err.toString());
           } 
           else
           {
              res.send(result.rows[0].username);    
           }
       });
   } 
   else
   {
       res.status(400).send('You are not logged in');
   }
});


app.get('/logout', function(req,res){
   delete req.session.auth;
   res.send('<div class="alert alert-success"> Logged out successfully <a href="/"> Home </a> </div>');
});

var counter = 0;
app.get('/counter', function(req,res){
  counter += 1;
  res.send(counter.toString());
});

var comments = [];
app.get('/comment', function(req,res){
     var comment = req.query.c;
      console.log(comment);
     comments.push(comment);
     res.send(JSON.stringify(comments));
});

var pool = new Pool(config);
app.get('/test-db' , function(req,res){
   pool.query("SELECT * FROM test", function(err, result){
      if(err){
          res.status(500).send(err.toString());
      } else {
          res.send(JSON.stringify(result.rows[0]));
      }
   });
});

/*
app.get('/:articleName', function(req,res){
   var articleName = req.params.articleName;
   res.send(createTemplate(articles[articleName]));
});  */

var pool = new Pool(config);
app.get('/articles/:articleName', function(req,res){
  pool.query("SELECT * FROM article WHERE title = '" + req.params.articleName + "'" , function(err,result){
        
        if(err){
            res.status(500).send(err.toString());
        } else {
            if(result.rows.length === 0){
                res.status(404).send('Article not found');
            } else {
                var articleData = result.rows[0];
                res.send(createTemplate(articleData));
            }
        }
          
      });
});

app.get('/ui/:fileName', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', req.params.fileName));
});


var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
