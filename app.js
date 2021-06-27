setTimeout(function(){() =>{
    //do a location saved check here for initial loading
} }, 500);
var els = [];
var glinks;
var loader = true;
var saved;
serverURL = "http://nuggetapi.ddns.net"
function recieve(value, target){
  document.getElementById(target).innerHTML = value;
}
function save(name){
    //mimicing saving
    recieve("Location Saved: click load snow day prediction", "results")
    recieve("Location has been saved", 'locations')
    recieve("Click load snow day prediction above", 'snowfall')
    saved = name;
    console.log("saved location")
}
function recievePrediction(today, tomorrow){
  document.getElementById('results').innerHTML='';
  let td = document.createElement("H2");
  td.innerHTML='Today: ' + today;
  let tm = document.createElement("H2");
  tm.innerHTML = 'Tomorrow: ' + tomorrow;
  document.getElementById('results').appendChild(td);
  document.getElementById('results').appendChild(tm);
}
function recieveSearch(values, links){
  els = [];
  for(var i=0; i<values.length;i++){
    var li = document.createElement("LI");
    var btn = document.createElement("A");
    els.push(btn)
    glinks = links;
    btn.innerHTML = values[i];
    li.appendChild(btn);
    document.getElementById("results").appendChild(li);
  }
  for(let a = 0; a<els.length;a++){
    els[a].addEventListener("click", function(){
      save(glinks[a]);
    });
  }
}
function getLocations(search){
    var xmlhttp = new XMLHttpRequest();
    setLoader()
    xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var parsed = JSON.parse(this.responseText);
        recieveSearch(parsed.resultText, parsed.resultLinks)
        setLoader()
        }
    };
    xmlhttp.open("GET", `${serverURL}/search/${search}`, true);
    xmlhttp.send();
}
function getPrediction(){
    var xmlhttp = new XMLHttpRequest();
    setLoader()
    xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var parsed = JSON.parse(this.responseText);
            recievePrediction(parsed.today, parsed.tomorrow)
            setLoader()
        }
    };
    xmlhttp.open("GET", `${serverURL}/getprediction/${saved}`, true);
    xmlhttp.send();
}
function openNav() {
  document.getElementById("mySidenav").style.width = "150px";
  for(var el of document.getElementsByClassName("main")){
    el.style.marginLeft = "150px";
  }
  document.body.style.backgroundColor = "rgba(0,0,0,0)";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
  for(var el of document.getElementsByClassName("main")){
    el.style.marginLeft = "0";
  }    document.body.style.backgroundColor = "black";
}
function setLoader(){
  if(loader){
    document.getElementsByClassName('loader')[0].style.display = 'block';
    loader = false;
  }
  else{
    document.getElementsByClassName('loader')[0].style.display = 'none';
    loader = true;
  }
  
}
function writeFile() {
  var type = window.TEMPORARY;
  var size = 5*1024*1024;
  window.requestFileSystem(type, size, successCallback, errorCallback)

  function successCallback(fs) {
     fs.root.getFile('log.txt', {create: true}, function(fileEntry) {

        fileEntry.createWriter(function(fileWriter) {
           fileWriter.onwriteend = function(e) {
              alert('Write completed.');
           };

           fileWriter.onerror = function(e) {
              alert('Write failed: ' + e.toString());
           };

           var blob = new Blob(['Lorem Ipsum'], {type: 'text/plain'});
           fileWriter.write(blob);
        }, errorCallback);
     }, errorCallback);
  }

  function errorCallback(error) {
     alert("ERROR: " + error.code)
  }
}