var express = require('express');
var morgan = require('morgan');
var path = require('path');

var app = express();
app.use(morgan('combined'));


var articles = {
  'article-one': { title: 'Article One | Parveen Khurana', heading : 'Article One', date : 'Feb 4, 2017', content: 
  `
  <p> this is the first paragraph </p>
  <p> its working </p>
  
  `
  },
  'artcile-two': {title: 'Article Two | Parveen Khurana', heading : 'Article Two', date : 'Feb 11, 2017', content: 
  `
  <p> this is the second paragraph </p>
  <p> its working </p>
  
  `},
  'artcile-three' : {title: 'Article Three | Parveen Khurana', heading : 'Article Three', date : 'Feb 4, 2017', content: 
  `
  <p> this is the third paragraph </p>
  <p> its working </p>
  
  `}
};

function createTemplate(data){
  var title = data.title;
  var date = data.date;
  var heading = data.heading;
  var content = data.content;
  
  var htmlTemplate = `
    <html>
    <head> <title> ${title} </title> </head>
    <body>
    <h3> ${heading} </h3>
    <div> ${date} </div>
    
    <div> ${container} </div>
    </body>
    </html>
  `;
  
  return htmlTemplate;
}

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

app.get('/:articleName', function(req,res){
    var articleName = req.params.articleName;
  res.send(createTemplate(articles[articleName]));    
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});


var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
