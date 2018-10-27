(function () {
    'use strict';
	Date.prototype.getUnixTime = function() { return this.getTime()/1000|0 };
	if(!Date.now) Date.now = function() { return new Date(); }
	Date.time = function() { return Date.now().getUnixTime(); }
	
	var url = window.location.href;
    console.log(url);
	console.log(localStorage.getItem("token"));
	var obj = parseURLParams(url);
	console.log(obj['token'][0]);
	console.log(obj['username'][0]);
	console.log(localStorage.getItem("token"));
	
	var username = obj['username'][0];
	var token = obj['token'][0];
	var home = "http://localhost:8080/page?username=" + username + "&token=" + token; 
	document.getElementById("home").setAttribute("href",home);
	document.getElementById("setting").addEventListener("click",setting);
	document.getElementById("username").innerHTML = username;
	document.getElementById("user").innerHTML = username;
	document.getElementById("plus").addEventListener("click",postPost);
	document.getElementById("submit").addEventListener("click",send);
	document.getElementById("logout").addEventListener("click",clear);
//	document.getElementById("pic").setAttribute("onchange","previewFile()");
	
	GetPost(token);
	
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
	
	
	function GetPost(token){
		var headers = new Headers();
		headers.append('Authorization',token);
		console.log(headers);
		const rawResponse = fetch('http://localhost:5000/user/', {
				method: 'GET',
				headers: new Headers({
						'Authorization': 'Token '+ token, 
						'Content-Type': 'application/x-www-form-urlencoded'
			  })
			  }).then(function(response){
				  console.log(response.status);
				  return response.json();
			  })
			  .then(function(myJson){
				  console.log(myJson);
				  document.getElementById("details").innerHTML = "Posts:	"+ myJson['posts'].length + " 	Followers:	" + myJson['following'].length + " 	Followings:	" + myJson['followed_num'];
				  var n = myJson['posts'].length;
				  if(n == 0){
					document.getElementById("warning").style.display = "block";
				  }
				  else{
					  myJson['posts'].sort(function(a, b){return b-a});
					  console.log("sorted : " + myJson['posts']);
					  for(var i = 0;i < myJson['posts'].length;i ++){
						  if(i == 10){
							var myNode = document.getElementById("posts");
							while (myNode.firstChild) {
								myNode.removeChild(myNode.firstChild);
							}
						  }
						  var add = "http://localhost:5000/post/?id="+myJson['posts'][i];
						  console.log(add);
						  fetch(add, {
								method: 'GET',
								headers: new Headers({
										'Authorization': 'Token '+ token, 
										'Content-Type': 'application/x-www-form-urlencoded'
							  })
							  }).then(function(response){
								  console.log(response.status);
								  return response.json();
							  })
							  .then(function(json){
									console.log(json);
									var element = document.getElementById("posts");
								  	var pic = document.createElement("img");
									var address = "data:image/png;base64,"+json['src'];
									//console.log("address of picture");
									//console.log(address);
									pic.setAttribute("src",address);
									pic.setAttribute("style","width:100%;display:block;");
									pic.setAttribute("alt",json['id']);
									element.appendChild(pic);
									var line = document.createElement("hr");
									element.appendChild(line);
									
									var table = document.createElement("table");
									var tr = document.createElement("tr");
									var td = document.createElement("td");
									

									var unlike = document.createElement("img");
									var iconU = "";
									if(json['meta']['likes'].includes(myJson['id'])){
										iconU = "images/like.png";
									}
									else{
										iconU = "images/unlike.png";
									}
									console.log(iconU);
									
									unlike.setAttribute("src",iconU);
									var idU = "like"+json['id'];
									unlike.setAttribute("id",idU);
									unlike.setAttribute("style","width:30px;display:block;margin-right:20px;");
									td.appendChild(unlike);
									
									var comment = document.createElement("img");
									var iconC= "images/comment.png";
									comment.setAttribute("src",iconC);
									var idC = "comment"+json['id'];
									comment.setAttribute("id",idC);
									comment.setAttribute("style","width:30px;display:block;margin-right:20px;");
									
									var td1 = document.createElement("td");
									td1.appendChild(comment);
									tr.appendChild(td);
									tr.appendChild(td1);
									table.appendChild(tr);
									element.appendChild(table);
									
									var num = document.createElement("p");
									var numOfL =  document.createTextNode(json['meta']['likes'].length + " likes");
									var loveid = "Love"+json['id'];
									num.setAttribute("id",loveid);
									num.setAttribute("style","font-family: 'Lobster', cursive; color:#FF6347;margin-bottom:0;");
									num.appendChild(numOfL);
									element.appendChild(num);
									console.log(document.getElementById(loveid));
									document.getElementById(loveid).addEventListener("click", showAllLike);
									
									var likeP = document.createElement("div");
									likeP.setAttribute("style","display:none;");
									var likeListid = "likeList"+json['id'];
									likeP.setAttribute("id",likeListid);
									element.appendChild(likeP);
									
									var line3 = document.createElement("hr");
									element.appendChild(line3);
									for(var i = 0;i < json['meta']['likes'].length;i ++){
										 var someone = "http://localhost:5000/user/?id="+json['meta']['likes'][i];
										  console.log(someone);
										  fetch(someone, {
											method: 'GET',
											headers: new Headers({
													'Authorization': 'Token '+ token, 
													'Content-Type': 'application/x-www-form-urlencoded'
										  })
										  }).then(function(response){
											  console.log(response.status);
											  return response.json();
										  })
										  .then(function(js){
											console.log(js);
											var body = document.createTextNode(js['username']+" ");
											document.getElementById(likeListid).appendChild(body);
										  })
									}
			
									
									var p = document.createElement("p");
									var txt;
									if(json['meta']['description_text'] != ""){
										txt = document.createTextNode(json['meta']['author'] + " : " + json['meta']['description_text']);
									}
									else{
										txt = document.createTextNode(json['meta']['author'] + " : No Description");
									}
									p.setAttribute("style","font-family: 'Niramit', sans-serif;margin-bottom:0;");
									p.appendChild(txt);
									element.appendChild(p);
									
									var p1 = document.createElement("p");
									var tx;
									tx = document.createTextNode("Comments below: ");
									p1.setAttribute("style","font-family: 'Lobster', cursive; color:#FF6347;margin-bottom:0;");
									p1.appendChild(tx);
									element.appendChild(p1);
									
									var comments = json['comments'];
									console.log("comment detail");
									console.log(comments);
									
									var sectionC = document.createElement("div");
									var commentid = "commentFor"+json['id'];
									sectionC.setAttribute("id",commentid);
									element.appendChild(sectionC);
									var CurrentS = document.getElementById(commentid);
									
									
									if(comments.length == 0){
										var string = document.createElement("p");
										var com = document.createTextNode("No comments yet");
										string.setAttribute("style","font-family: 'Lobster', cursive; color:#696969;margin-bottom:0;margin-left:1%;");
										string.appendChild(com);
										var msg = "noComment"+json['id'];
										string.setAttribute("id",msg);
										CurrentS.appendChild(string);
									}

									for(var j = 0;j < comments.length;j ++){
										if(j == 9){
											var show = document.createElement("button");
											var explain = document.createTextNode("Show all comments ...");
											show.appendChild(explain);
											show.setAttribute("class","btn btn-link");
											show.setAttribute("style","color:orange;");
											var showid = "show" + json['id'];
											show.setAttribute("id",showid);
											CurrentS.appendChild(show);
											document.getElementById(showid).addEventListener("click", showAll);
											console.log(showid);
											
											var section = document.createElement("div");
											section.setAttribute("style","display:none;");
											var contentid = "content" + json['id'];
											section.setAttribute("id",contentid);	
											CurrentS.appendChild(section);
										}
										if(j >= 9){				
											var d = new Date(comments[j]['published']*1000);
											var string = d.toString();
											var current = string.slice(0, 21);
											var author = document.createElement("p");
											author.setAttribute("style","margin-bottom:0;font-size:13px;");
											var says =  document.createTextNode(comments[j]['author'] + " : "+ comments[j]['comment'] + "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0(" + current + ")");
											author.appendChild(says);
											document.getElementById(contentid).appendChild(author);
										}
										else{ 
											var d = new Date(comments[j]['published']*1000);
											var string = d.toString();
											var current = string.slice(0, 21);
											var author = document.createElement("p");
											author.setAttribute("style","margin-bottom:0;font-size:13px;");
											var says =  document.createTextNode(comments[j]['author'] + " : "+ comments[j]['comment'] + "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0(" + current + ")");
											author.appendChild(says);
											CurrentS.appendChild(author);
											console.log(d);
										}
									}
									
									var line2 = document.createElement("hr");
									line2.setAttribute("id","finalLine");
									element.appendChild(line2);
									
									var currL = "like" + json['id'];
									console.log('here');
									console.log(document.getElementById(currL));
									document.getElementById(currL).addEventListener("click", Likey);
									
									var currC = "comment"+json['id'];
									console.log(document.getElementById(currC));
									document.getElementById(currC).addEventListener("click", CommentTo);
							  })
					  }
					  
				  }
				  console.log(myJson);
		});
		
		return false;
	}
	
	
	function Likey(){
		console.log(this.id);
		
		var post = this.id.substring(4,this.id.length);
		console.log(post);
		console.log(document.getElementById(this.id).src);
		if(document.getElementById(this.id).src === "http://localhost:8080/images/unlike.png"){
			 var someone = "http://localhost:5000/post/like/?id="+post;
			  console.log(someone);
			  fetch(someone, {
				method: 'PUT',
				headers: new Headers({
						'Authorization': 'Token '+ token, 
						'Content-Type': 'application/x-www-form-urlencoded'
			  })
			  }).then(function(response){
				  console.log(response.status);
				  return response.json();
			  })
			  .then(function(js){
				console.log(js);
				var temp = "like"+post;
				document.getElementById(temp).src = "images/like.png";
				var lovelist = "Love" + post;
				var num = document.getElementById(lovelist).innerHTML.substring(0,1);
				console.log(num);
				num ++;
				console.log(num);
				document.getElementById(lovelist).innerHTML = num + " likes";
				var body = document.createTextNode(username+" ");
				var likeL = "likeList" + post;
				document.getElementById(likeL).appendChild(body);
				console.log(document.getElementById(likeL));
			  })
		}
		else{
			  var someone = "http://localhost:5000/post/unlike/?id="+post;
			  console.log(someone);
			  fetch(someone, {
				method: 'PUT',
				headers: new Headers({
						'Authorization': 'Token '+ token, 
						'Content-Type': 'application/x-www-form-urlencoded'
			  })
			  }).then(function(response){
				  console.log(response.status);
				  return response.json();
			  })
			  .then(function(js){
				console.log(js);
				var temp = "like"+post;
				document.getElementById(temp).src = "images/unlike.png";
				var loveid = "Love" + post;
				var num = document.getElementById(loveid).innerHTML.substring(0,1);
				console.log(num);
				num --;
				console.log(num);
				document.getElementById(loveid).innerHTML = num + " likes";
				var con = "likeList" + post;
				var l = document.getElementById(con);
				var str = l.textContent;
				console.log(l.textContent);
				var res = str.split(" ");
				console.log(res[0]);
				console.log("length of childenode");
				console.log(l.childNodes.length);
				for(var u = 0;u < l.childNodes.length;u ++){
					if(res[u] === username){
						l.removeChild(l.childNodes[u]);
					}
				}
			  })
		}
	}
	
	function CommentTo(){
		console.log(this.id);
		var post = this.id.substring(7,this.id.length);
		console.log(post);
		
		var txt;
		var comment = prompt("Comment below : ");
		if (comment == null || comment == "") {
			alert("Enter your comment");
			return;
		} else {
			txt = comment;
		}
		console.log(txt);
		
		var today = new Date();
		console.log(today.toString());
		console.log(today.getUnixTime());
		console.log(username);
		const po = {
			"author": username,
			"published": today.getUnixTime(),
			"comment": txt
		}
		var url = 'http://localhost:5000/post/comment?id=' + post;
		fetch(url, {
				method: 'PUT',
				headers: {
				  'Authorization': 'Token '+ token, 
				  'Accept': 'application/json',
				  'Content-Type': 'application/json'
				},
				body: JSON.stringify(po)
			  }).then(function(response){
				  console.log(response.status);
				  return response.json();
			  })
			  .then(function(myJson){
				  console.log(myJson);
				  
				  var el = document.getElementById("finalLine");
				  el.parentNode.removeChild(el);
				  var msg = "noComment" + post;
				  if(document.getElementById(msg)){
					document.getElementById(msg).style.display = "none";
				  }
					var d = today;
					var string = d.toString();
					var current = string.slice(0, 21);
					var author = document.createElement("p");
					author.setAttribute("style","margin-bottom:0;font-size:13px;");
					var says =  document.createTextNode(username+ " : "+ txt + "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0(" + current + ")");
					author.appendChild(says);
					var commentid = "commentFor" + post;
					document.getElementById(commentid).appendChild(author);
					
					var line2 = document.createElement("hr");
					line2.setAttribute("id","finalLine");
					document.getElementById(commentid).appendChild(line2);
					console.log(d);
			  })
	}
	
	function showAll(){
		console.log(this.id);
		var post = this.id.substring(4,this.id.length);
		console.log(post);
		var commid = "content"+ post;
		if(document.getElementById(commid).style.display == "none"){
			console.log("none");
			document.getElementById(commid).style.display = "block";
		}
		else{
			console.log("block");
			document.getElementById(commid).style.display = "none";
		}
	}
	
	function showAllLike(){
		console.log(this.id);
		var post = this.id.substring(4,this.id.length);
		console.log(post);
		var likelist = "likeList" + post;
		if(document.getElementById(likelist).style.display == "none"){
			console.log("none");
			document.getElementById(likelist).style.display = "block";
		}
		else{
			console.log("block");
			document.getElementById(likelist).style.display = "none";
		}
	}
	
	function postPost(){
		console.log(this.id);
		document.getElementById('id01').style.display='block';
	}
	
	function send(){
		console.log(this.id);
		var pic = document.getElementById("pic");
		var descri = document.getElementById("txt").value;
		console.log("picture url := " + pic);
		console.log("description := " + descri);
		
		if(pic == ""){
			alert("Please select a png file.");
		}
		else if(descri == ""){
			alert("Description could not be empty.");
		}
		else{
			console.log("picture url := " + pic);
			console.log("description := " + descri);
			var file = localStorage.getItem("picture");
			console.log(file);
			var filepath = file.slice(22, file.length);
			console.log(filepath);
			const info = {
				"description_text": descri,
				"src" : filepath
			}
			
			fetch('http://localhost:5000/post/', {
				method: 'POST',
				headers: {
				  'Authorization': 'Token '+ token, 
				  'Accept': 'application/json',
				  'Content-Type': 'application/json'
				},
				body: JSON.stringify(info)
			  }).then(function(response){
				  if(response.status !== 200){
					  alert("Upload error");
					  return;
				  }
				  console.log(response.status);
				  return response.json();
			  })
			  .then(function(myJson){
				  console.log(myJson);
				  location.reload();
			  })
			 //location.reload();
		}
	}
	
	function clear(){
		console.log("logout user");
		localStorage.clear();
	}

	function setting(){
		console.log("setting request");
		 window.location = '/setting?username=' + username + '&token=' + token;
	}

}());

