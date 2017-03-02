var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var crypto = require('crypto');

var config = {
    user: 'prvnk10',
    database: 'prvnk10',
    host: 'db.imad.hasura-app.io',
    port: '5432',
    password: process.env.DB_PASSWORD
};


var app = express();
app.use(morgan('combined'));


var articles = {
  'article-one': { title: 'Article One | Parveen Khurana', heading : 'Article One', date : 'Feb 4, 2017', content: `

  <p> this is the first paragraph </p>
  <p> its working </p>
  
  `
  },
  'article-two': {'title': 'Article Two | Parveen Khurana', 'heading' : 'Article Two', 'date' : 'Feb 11, 2017', 'content': `
  <p> this is the second paragraph </p>
  <p> its working </p>
  
  `},
  'article-three' : {title: 'Article Three | Parveen Khurana', heading : 'Article Three', date : 'Feb 4, 2017', content: `
  <p> this is the third paragraph </p>
  <p> its working </p>
  
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
    <title> ${title} </title> </head>
    <body>
    <h3> ${heading} </h3>
    <div> ${date} </div>
    
    <div> ${content} </div>
    <div>
    <input type='text' id='comment'> </input>
    <input type='submit' name='submit' value='submit' id='submit_btn'>
    </input> 
    <span id='showComments'> </span>
    </div>
    </body>
    </html>
  `;
  
  return htmlTemplate;
}

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

var counter = 0;
app.get('/counter', function(req,res){
  counter += 1;
  res.send(counter.toString());
});

var comments = [];
app.get('/comment', function(req,res){
     var comment = req.params.c;
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

app.get('/:articleName', function(req,res){
   var articleName = req.params.articleName;
   res.send(createTemplate(articles[articleName]));
});

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

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/bootstrap.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'bootstrap.css'));
});

app.get('/ui/bootstrap.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'bootstrap.js'));
});

function hash(input, salt){
  var hashed = hash(input, salt, 10000, 512, 'sha512');
  return hashed.toString('hex');
}

app.get('/hash/:input', function(req,res){
   var hashedString = hash(req.params.input, 'this-is-some-random-string');
   res.send(hashedString);
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

app.get('/ui/fb-icon.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'fb-icon.png'));
});

app.get('/ui/linked-icon.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'linked-icon.png'));
});

app.get('/ui/github-icon.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'github-icon.png'));
});
  
app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});

app.get('/ui/p.jpg', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'p.jpg'));
});


var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
