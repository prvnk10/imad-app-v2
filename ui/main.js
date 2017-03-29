console.log('Loaded!');

function tryThis(){
  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function(){
  if(xhttp.readyState === XMLHttpRequest.DONE && xhttp.status === 200){
      var span = document.getElementById('likes');
      span.innerHTML = xhttp.responseText;
    }
 };
 xhttp.open('GET', '/counter', true);
 xhttp.send('null');
}


function submitComment(){

  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function(){
  if(xhttp.readyState === XMLHttpRequest.DONE && xhttp.status === 200){

    var comments = xhttp.responseText;
    comments = JSON.parse(comments);

     list = '';
    for(var i=0; i<comments.length ; i++){
     list += '<li>' + comments[i] + '</li>';
    }

    var comment_box = document.getElementById('showComments');
    comment_box.innerHTML = list;

    }
  };

  var commentInput = document.getElementById('comment');
  comment = commentInput.value;
  xhttp.open('GET', '/comment?c=' + comment, true);
  xhttp.send(null);

}

function login()
{
   var xhttp = new XMLHttpRequest();
   xhttp.onreadystatechange = function(){
       
   if(xhttp.readyState === XMLHttpRequest.DONE && xhttp.status === 200)
   {
     alert('successfully logged in');
   }
   else if(xhttp.status === 403)
   {
       alert('username/pw is invalid');
   }
   else if(xhttp.status === 500)
   {
       alert('something went wrong on the server');
   }
   
   };  
    
    var username = document.getElementById('username').value;
    var password = document.getElementById('pwd').value;
    alert(username.length);
    if(username.length != 0  && password.length != 0)
    {
        alert(324);
        xhttp.open('POST', 'http://prvnk10.imad.hasura-app.io/login', true);
        xhttp.setRequestHeader('Content-Type', 'application/json');
        xhttp.send(JSON.stringify({username: username, password: password}));
    }
}