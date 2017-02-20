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
