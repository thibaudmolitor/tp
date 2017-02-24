var express = require('express'),
	app = express(),
	body = 	require('body-parser'),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server),
	users = [];
	
server.listen(3001,"0.0.0.0");

// parse application/x-www-form-urlencoded 
app.use(body.urlencoded({ extended: false }))
 
// parse application/json 
app.use(body.json())




/********** ROUTE **************/

/* Home - GET (Route par default pour le navigateur web) */
app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

/* Register - POST */
app.post('/login', function(req, res){
	users.push(req.body);
	res.send(users);
});




// route pour connection
/* Login - POST */
app.put('/login', function(req, res){
	// definir une function a vide pour stocker les infos de notre utilisateur
	var theUser = {};
	// on definit la variable qui contient le message d'erreur
	var error = {"error":true,"message":"Fail"};
	users.forEach(function(user){
		// si le phone poster par l'utilisateur (y en a un)
		if (req.body.phone){
			// un des phone de notre Jason est egal au phone poster par l'utilisateur
			if(user.phone == req.body.phone)
				// je stock toute les infos de notre utilisateur dans une variable
				theUser = user
		}else{
			// pareil pour le mail
			if(user.mail == req.body.mail)
				theUser = user
		}
	});
	// si le password  poster de notre utilisateur  (y en a un)
	if(theUser.password){
		//  password poster par l'utilisateur est egal a un des password de notre Jason
		if(theUser.password == req.body.password)
			// je retourne les infos de l'utilisateur qui c'est co
			res.send(theUser);
		else
			res.send(error);
	}else
		res.send(error);
});