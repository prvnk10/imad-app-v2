console.log('Loaded!');

function tryThis(){
  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function(){
  if(xhttp.readyState === XMLHttpRequest.DONE && xhttp.status === 200){
      var span = document.getElementById('commentValue');
      span.innerHTML = xhttp.responseText;
    }
 };
 xhttp.open('GET', '/counter', true);
 xhttp.send(null);
}


function submitComment(){

  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function(){
  if(xhttp.readyState === XMLHttpRequest.DONE && xhttp.status === 200){

    var comments = xhttp.responseText;
    comments = JSON.parse(comments);

     
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