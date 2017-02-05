var express = require('express');
var morgan = require('morgan');
var path = require('path');

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

app.get('/:articleName', function(req,res){
   var articleName = req.params.articleName;
   res.send(createTemplate(articles[articleName]));
});




app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});


var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
