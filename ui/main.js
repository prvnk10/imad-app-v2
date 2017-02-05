console.log('Loaded!');


var submit = document.getElementById('submit_btn');

submit.onclick = function(){
    var xhttp = new XMLHTTPRequest();
    
    xhttp.onreadystatechange = function(){
        if(xhttp.readyState == XMLHttpRequest.DONE && xhttp.status == 200){
            
            var comments = xhttp.responseText
            comments = JSON.parse(comments);
            
            for(var i=0; i<comments.length ; i++){
                list += '<li>' + comments[i] + '</li>';
            }
            
            var comment_box = document.getElementById('showComments');
            comment_box.innerHTML = list;
            
        }
    };
    
    var commentInput = document.getElementById('comment');
    commment = commentInput.value;
    xhttp.open('GET', 'http://prvnk10.imad.hasura-app.io/comment?comment=' + comment, true);
    xhttp.send(null);
};