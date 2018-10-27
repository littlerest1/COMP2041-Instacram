(function () {
    'use strict';
	var url = window.location.href;
    console.log(url);
	console.log(localStorage.getItem("token"));
	var obj = parseURLParams(url);
	console.log(obj['token'][0]);
	console.log(obj['username'][0]);
	console.log(localStorage.getItem("token"));
	console.log("Current user = " + localStorage.getItem("host"));
	
	var username = obj['username'][0];
	var token = obj['token'][0];
	var home = "http://localhost:8080/page?username=" + username + "&token=" + token; 
	var profilePage = "http://localhost:8080/homepage?username=" + username + "&token=" + token; 
	
	document.getElementById("home").setAttribute("href",home);
	document.getElementById("user").innerHTML = username;
	document.getElementById("user").setAttribute("href",profilePage);
	document.getElementById("logout").addEventListener("click",clear);
	document.getElementById("tab-1").addEventListener("click",Cpassword);
	document.getElementById('tab-2').addEventListener("click",Cusername);
	document.getElementById('tab-3').addEventListener("click",Cemail);
	
	function parseURLParams(url) {
		var queryStart = url.indexOf("?") + 1,
			queryEnd   = url.indexOf("#") + 1 || url.length + 1,
			query = url.slice(queryStart, queryEnd - 1),
			pairs = query.replace(/\+/g, " ").split("&"),
			parms = {}, i, n, v, nv;

		if (query === url || query === "") return;

		for (i = 0; i < pairs.length; i++) {
			nv = pairs[i].split("=", 2);
			n = decodeURIComponent(nv[0]);
			v = decodeURIComponent(nv[1]);

			if (!parms.hasOwnProperty(n)) parms[n] = [];
			parms[n].push(nv.length === 2 ? v : null);
		}
		return parms;
	}
	
	function Cpassword(){
		console.log("changing password");
		document.getElementById('Cpassword').style.display="block";
		document.getElementById('tab-1').setAttribute("class","nav-link active");
		document.getElementById('Cusername').style.display="none";
		document.getElementById('tab-2').setAttribute("class","nav-link");
		document.getElementById('Cemail').style.display="none";
		document.getElementById('tab-3').setAttribute("class","nav-link");
		
		var 
	}
	
	function Cusername(){
		console.log("changing username");
		document.getElementById('Cpassword').style.display="none";
		document.getElementById('tab-1').setAttribute("class","nav-link");
		document.getElementById('Cusername').style.display="block";
		document.getElementById('tab-2').setAttribute("class","nav-link active");
		document.getElementById('Cemail').style.display="none";
		document.getElementById('tab-3').setAttribute("class","nav-link");
	}
	
	function Cemail(){
		console.log("changing email");
		document.getElementById('Cpassword').style.display="none";
		document.getElementById('tab-1').setAttribute("class","nav-link");
		document.getElementById('Cusername').style.display="none";
		document.getElementById('tab-2').setAttribute("class","nav-link");
		document.getElementById('Cemail').style.display="block";
		document.getElementById('tab-3').setAttribute("class","nav-link active");
	}
	
	function clear(){
		console.log("logout user");
		localStorage.clear();
	}
}());