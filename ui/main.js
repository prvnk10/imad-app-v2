//console.log('Loaded!');

var comment = document.getElementById('comment');
var submit = document.getElementById('submit_btn');

submit.onclick = function(){
    var xhttp = new XMLHTTPRequest();
    
    xhttp.onreadystatechange = function(){
        if(xhttp.readyState == XMLHttpRequest.DONE && xhttp.status == 200){
            var comment_box = document.getElementById('showComments');
            comment_box.innerHTML = xhttp.responseText;
            
        }
    };
    
    xhttp.open('GET', 'http://prvnk10.imad.hasura-app.io/comment', true);
    xhttp.send(null);
};