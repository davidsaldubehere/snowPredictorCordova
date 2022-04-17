var els = [];
var glinks;
var loader = true;
var loaded;
serverURL = "http://nuggetapi.ddns.net"
document.addEventListener('deviceready', function() {
    readFile()
    setTimeout(function(){
        if(loaded.length > 2){
            isLoaded()
        }      
    }, 1000);
    
    
}, false)
function recieve(value, target){
    document.getElementById(target).innerHTML = value;
}
function save(name){
    //mimicing saving
    isLoaded()
    writeFile(name)
}
function isLoaded(){
    recieve("Location Saved: click load snow day prediction", "results")
    recieve("Location has been saved", 'locations')
    recieve("Click load snow day prediction above", 'snowfall')
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
    alert(`${serverURL}/search/${search}`)
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
    readFile()
    setTimeout(function(){
        xmlhttp.open("GET", `${serverURL}/getprediction/${loaded}`, true);
        xmlhttp.send();
    }, 1000);
    

}
function openNav() {
    document.getElementById("mySidenav").style.width = "150px";
    for(var el of document.getElementsByClassName("main")){
        el.style.marginLeft = "150px";
    }
    document.body.style.backgroundColor = "white";
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
function writeFile(data) {
    var type = window.TEMPORARY;
    var size = 5*1024*1024;
    window.requestFileSystem(type, size, successCallback, errorCallback)
    
    function successCallback(fs) {
        fs.root.getFile('locations.txt', {create: true}, function(fileEntry) {
            console.log(fs.root)
            fileEntry.createWriter(function(fileWriter) {
                fileWriter.onwriteend = function(e) {
                    console.log('Write completed.');
                };
                
                fileWriter.onerror = function(e) {
                    alert('Write failed: ' + e.toString());
                };
                
                var blob = new Blob([data], {type: 'text/plain'});
                fileWriter.write(blob);
            }, errorCallback);
        }, errorCallback);
    }
    
    function errorCallback(error) {
        alert("ERROR: " + error.code)
    }
}
function readFile() {
    var type = window.TEMPORARY;
    var size = 5*1024*1024;
    window.requestFileSystem(type, size, successCallback, errorCallback)
    
    function successCallback(fs) {
        fs.root.getFile('locations.txt', {}, function(fileEntry) {
            
            fileEntry.file(function(file) {
                var reader = new FileReader();
                
                reader.onloadend = function(e) {
                    loaded=this.result;
                    
                };
                reader.readAsText(file);
            }, errorCallback);
        }, errorCallback);
    }
    
    function errorCallback(error) {
        console.log("ERROR: " + error.code)
    }
}	
//removes file from the system
function removeFile() {
    var type = window.TEMPORARY;
    var size = 5*1024*1024;
    window.requestFileSystem(type, size, successCallback, errorCallback)
    
    function successCallback(fs) {
        fs.root.getFile('locations.txt', {create: false}, function(fileEntry) {
            
            fileEntry.remove(function() {
                recieve("Location cleared: Search for a new location", 'locations')
                recieve("", "results")
            }, errorCallback);
        }, errorCallback);
    }
    
    function errorCallback(error) {
        alert("ERROR: " + error.code)
    }
}	