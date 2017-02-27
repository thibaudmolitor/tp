var express = require('express'),
	app = express(),
	body = 	require('body-parser'),
	fs = 	require('fs'),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server),
	users = []; // Bdd

	
server.listen(3001,"0.0.0.0"); // Lancement du serveur

// parse application/x-www-form-urlencoded 
app.use(body.urlencoded({ extended: false }))
 
// parse application/json 
app.use(body.json())




/********** ROUTE **************/

/* Home - GET (Route par default pour le navigateur web) */
app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

// enregistrer un utilisateur
/* Register - POST */
app.post('/register', function(req, res){
	users.push(req.body); // Insert Into
	res.send(users);
});




// route pour connection
/* Login - POST */
app.post('/login', function(req, res){
	// definir une function a vide pour stocker les infos de notre utilisateur
	var theUser = {};
	// on definit la variable qui contient le message d'erreur
	var error = {"error":true,"message":"Fail"};
	users.forEach(function(user){ // fetchAll - Foreach
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
	
// pour changer le password
app.put('/login', function(req, res){
	var theUser = {};
	usersBis = []; // Bdd
	var newPassword;
	users.forEach(function(user){
		if (req.body.phone){
			// un des phone de notre Jason est egal au phone poster par l'utilisateur
			if(req.body.phone == user.phone){
				newPassword = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
				user.password = newPassword;
			}
			usersBis.push(user); // Insert Into	
		}
	});
	users = usersBis;
	res.send(newPassword);
	
});

// modification des infos users, subtilités selon les données envoyés par l'utilisateur

//route en put car update d'information
app.put('/editInfomation', function(req, res){
    var theUser = {};
    usersBis = [];
    users.forEach(function(user){
         if (req.body.phone){


            if(req.body.phone == user.phone){
            	
                for (var param in req.body) {
                	
                    user.password = (req.body.password)? req.body.password : user.password;
                    user.name = (req.body.name)? req.body.name : user.name;
                    user.mail = (req.body.mail)? req.body.mail : user.mail;
                    theUser = user;
                }
            }
            usersBis.push(user);
        }
    });
    users = usersBis;
    
    res.send(theUser);
})

 
//c'est le code pour la modification des infos des utilisateurs

app.post('/fichier', function(req, res){
	var name = req.body.name;
	var error = {"error":true,"message":"Fail"};
	fs.writeFile('message.txt', name, (err) => {
		if (err) res.send(error);
		res.send({"error":false,"message":"It\'s saved!"});
	});
		// fs.watch('./tmp', {encoding: 'base64'}, (eventType, filename) => {
  			// if (filename)
    		// console.log(filename);
   		// 
		// });
		// fs.createReadStream('sample.txt', {start: 90, end: 99});
		// 
		// const path = require('path');
		// fs.mkdtemp(tmpDir + path.sep, (err, folder) => {
		//  if (err) throw err;
		//  console.log(folder);
		  // Will print something similar to `/tmp/abc123`.
		  // A new temporary directory is created within
		  // the /tmp directory.
		//	});
		//	fs.openSync(path, flags[, mode])
		//	fs.readFile(file[, options], callback)
	
});