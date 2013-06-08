var express = require('express');
var showsome = require('./showsome');
var ShowsomeDb = require('./showsome').ShowsomeDb;
var http = require('http')
  , path = require('path');

var app = express();//.createServer();
app.configure(function () {
    app.use(express.logger('dev'));    
    app.use(express.bodyParser());//it will parse json request bodies (as well as others), and place the result in req.body:
});

var showsomeDb = new ShowsomeDb('localhost', 27017);

app.use('/public', express.static(__dirname+'/public_html'));
app.use('/', express.static(__dirname+'/public_html'));

app.get('/games' , function(req, res) {
	showsomeDb.findAll(function(error, games){
		res.send(JSON.stringify([
        {
            // a game object
            "_id": 000,
            "uid0": "100002058341130",
            "uid1": "100001053996829",
            "next": "0",
            "role": "r"
        },
        {
            "_id": 001,
            "uid0": "100002058341130",
            "uid1": "1127758094",
            "next": "1",
            "role": "r"
        },
        {
            "_id": 002,
            "uid0": "761779163",
            "uid1": "100002058341130",
            "next": "1",
            "role": "g"
        }
    ]));
	});
});

//TODO: none!
app.get('/games/:uid', function(req, res) {
	
	// gets the id
	var uid = req.params.uid;
	
	showsomeDb.getActiveGames(uid, function(error, result) {
		if (error) {
			console.log(error);
		} else {
			console.log(result);
			var userActiveGames = [];
			for (i = 0; i < result.length; i++) {
				console.log(result[i]);
				if (result[i].uid0 == uid) {
					game = new Game(result[i]._id, result[i].uid1, 1 - result[i].next, result[i].role);
				} else if (result[i].uid1 == uid) {
					game = new Game(result[i]._id, result[i].uid0, result[i].next, result[i].role);
				} else {
					// skip
					continue;
				}

				// adds the appropriate games to current games for this user
				userActiveGames.push(game);
			}
			
			// send respose
			res.send(JSON.stringify(userActiveGames));
		}
		
	});
	
});

app.post('/games', function(req, res) {

	var body = "";
	req.on('data', function(chunk) {
		body += chunk;
	});
	req.on('end', function() {
		console.log('POSTed: ' + body);
		
		incoming = JSON.parse(body);
		
		newGame = { 
		"uid0": incoming.uid0, 
		"uid1": incoming.uid1, 
		"next": 0,
		"role": "r"
		};
		
		// updates database
		showsomeDb.saveOne(newGame, function(val, callback) {
		
			//sends back the created game, with the new id
			res.send(newGame);
		});
	
	});
	

});



app.get('/game/:gameid', function(req, res) {
	
	// the given id for the requested game
	gameID = req.params.gameid;
	console.log(gameID);
	
	showsomeDb.findOne(gameID, function(error, result) {
		if (error) {
			console.log(error);
		} else {
			res.send(result);
			
		}
	});

});


app.get('/momo', function(req, res) {
	
showsomeDb.save([
        {
            // a game object
            "uid0": "100002058341130",
            "uid1": "100001053996829",
            "next": "0",
            "role": "r"
        },
        {
            "uid0": "100002058341130",
            "uid1": "1127758094",
            "next": "1",
            "role": "r"
        },
        {
            "uid0": "761779163",
            "uid1": "100002058341130",
            "next": "1",
            "role": "g"
        }
    ], function(callback) {});
	console.log("SAVED");
	res.send("saved");
});





// app.post('/games' ,showsome.putActiveGame); // id is given by the sever and returned to client
// app.get('/users' ,showsome.getUsers);
// app.post('/users' ,showsome.putUser);
// app.get('/game/:id' ,showsome.getGame);
// app.post('/game' ,showsome.putGame);
// app.delete('/game/:id' ,showsome.deleteGame);


//app.get('/students',student.findAll);
//app.get('/students/:id', student.findById);
//app.post('/students', student.addStudent);
//app.put('/students/:id', student.updateStudent);
//app.delete('/students/:id', student.deleteStudent);

app.listen(3000);


/**
 * Defines a game relative for this user.
 * 
 * @param {type} gameID - current game
 * @param {type} opponentID - user's opponent
 * @param {type} nextPlayer - 1 if you're the next player, else 0
 * @param {type} nextRole - the next state for this player (r - riddler, g - guesser)
 * @returns {Game}
 */
function Game(gameID, opponentID, nextPlayer, nextRole) {
    this._id = gameID;
    this.opponentID = opponentID;
    this.nextPlayer = nextPlayer;
    this.nextRole = nextRole;
}
