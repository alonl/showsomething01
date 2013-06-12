var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;
var fs = require("fs");


//*****************************************************************************
// mongo database
//*****************************************************************************

ShowsomeDb = function(host, port) {
  this.db= new Db('node-mongo-showsome', new Server(host, port, {safe: false}, {auto_reconnect: true}, {}));
  this.db.open(function(){});
};

ShowsomeDb.prototype.getCollection = function(callback) {
  this.db.collection('games', function(error, games_collection) {
    if( error ) callback(error);
    else callback(null, games_collection);
  });
};

ShowsomeDb.prototype.getCollectionWords = function(callback) {
  this.db.collection('words', function(error, words_collection) {
    if( error ) callback(error);
    else callback(null, words_collection);
  });
};

ShowsomeDb.prototype.getCollectionUsers = function(callback) {
  this.db.collection('users', function(error, users_collection) {
    if( error ) callback(error);
    else callback(null, users_collection);
  });
};

ShowsomeDb.prototype.getCollectionTurnInfoR = function(callback) {
  this.db.collection('turnInfoR', function(error, turnInfoR_collection) {
    if( error ) callback(error);
    else callback(null, turnInfoR_collection);
  });
};

ShowsomeDb.prototype.getCollectionTurnInfoG = function(callback) {
  this.db.collection('turnInfoG', function(error, turnInfoG_collection) {
    if( error ) callback(error);
    else callback(null, turnInfoG_collection);
  });
};

// return all registered users
ShowsomeDb.prototype.getAllUsers = function(callback) {
    this.getCollectionUsers(function(error, users_collection) {
      if( error ) callback(error)
      else {
        users_collection.find().toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};

// registers a user
ShowsomeDb.prototype.saveUser = function(user, callback) {
    this.getCollectionUsers(function(error, users_collection) {
      if( error ) callback(error)
	  
      else {
		user.created_at = new Date();
		users_collection.insert(user, function() {
        callback(null, user._id);
        });
      }
    });
};

//find all games
ShowsomeDb.prototype.findAll = function(callback) {
    this.getCollection(function(error, games_collection) {
      if( error ) callback(error)
      else {
        games_collection.find().toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};

// finds all words with the given difficulty
ShowsomeDb.prototype.getWordByDiff = function (diff, callback) {
	  this.getCollectionWords(function(error, words_collection) {
      if(error) callback(error)
      else {
        words_collection.find({difficulty: diff}).toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};

// we wrote
ShowsomeDb.prototype.getActiveGames = function(uid, callback) {
    this.getCollection(function(error, games_collection) {
      if( error ) callback(error)
      else {
        games_collection.find( { $or: [ {uid0: uid}, {uid1: uid} ] } ).toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};

//save new games
ShowsomeDb.prototype.saveGames = function(games, callback) {
    this.getCollection(function(error, games_collection) {
      if( error ) callback(error)
      else {
        if( typeof(games.length)=="undefined")
          games = [games];

        for( var i =0;i< games.length;i++ ) {
          game = games[i];
          game.created_at = new Date();
        }

       id = games_collection.insert(games, function() {
          callback(null, games);
        });
      }
    });
};

//save new words
ShowsomeDb.prototype.saveWords = function(words, callback) {
    this.getCollectionWords(function(error, words_collection) {
      if( error ) callback(error)
      else {
        if( typeof(words.length)=="undefined")
          words = [words];

        for( var i =0;i< words.length;i++ ) {
          word = words[i];
          word.created_at = new Date();
        }

        words_collection.insert(words, function() {
          callback(null, words);
        });
      }
    });
};

// save users
ShowsomeDb.prototype.saveUsers = function(users, callback) {
    this.getCollectionUsers(function(error, users_collection) {
      if( error ) callback(error)
      else {
        if( typeof(users.length)=="undefined")
          users = [users];

        for( var i =0;i< users.length;i++ ) {
          user = users[i];
          user.created_at = new Date();
        }

        users_collection.insert(users, function() {
          callback(null, users);
        });
      }
    });
};

// saves one game in the database
ShowsomeDb.prototype.saveOne = function(game, callback) {
    this.getCollection(function(error, games_collection) {
      if( error ) callback(error)
      else {
  
       id = games_collection.insert(game, function() {
          callback(null, game._id);
        });
      }
    });
};

// saves turn information riddler in the database
ShowsomeDb.prototype.saveTurnInfoR = function(turn, callback) {
    this.getCollectionTurnInfoR(function(error, turnInfoR_collection) {
      if( error ) callback(error)
      else {
	  
		  turn.created_at = new Date();
		  turnInfoR_collection.insert(turn, function() {
          callback(null, turn);
        });
      }
    });
};

// saves turn information guesser in the database
ShowsomeDb.prototype.saveTurnInfoG = function(turn, callback) {
    this.getCollectionTurnInfoG(function(error, turnInfoG_collection) {
      if( error ) callback(error)
      else {
	  
		  turn.created_at = new Date();
		  console.log("trying to upload image");
		  
		/*  if (image) {
				console.log("uploading image");
				data = fs.readFileSync(image.path);
				turn.photo = new MongoDb.Binary(data);
				turn.photoType = image.type;
		  } */
		  
		  turnInfoG_collection.insert(turn, function() {
          callback(null, turn._id);
        });
      }
    });
};


// find a single game in the game database
ShowsomeDb.prototype.findOne = function(gameID, callback) {
    this.getCollection(function(error, games_collection) {
      if( error ) callback(error)
      else {
        games_collection.find({_id: ObjectID(gameID)}).toArray(function(error, result) {
          if(error) callback(error)
          else callback(null, result[0])
        }); 
      }
    });
};

ShowsomeDb.prototype.getTurnInfoR = function(id, callback) {
    this.getCollectionTurnInfoR(function(error, turnInfoR_collection) {
      if( error ) callback(error)
      else {
        turnInfoR_collection.find({'gameID': id}).toArray(function(error, result) {
          if(error) callback(error)
          else callback(null, result)
        }); 
      }
    });
};

// gets a turn information guesser from db (without the image!!)
ShowsomeDb.prototype.getTurnInfoG = function(id, callback) {
    this.getCollectionTurnInfoG(function(error, turnInfoG_collection) {
      if( error ) callback(error)
      else {
        turnInfoG_collection.find( {'gameID': id}, { gameID: '1', word: '1', photo: '0', triesLeft: '1' } ).toArray(function(error, result) {
          if(error) callback(error)
          else callback(null, result[0])
        }); 
      }
    });
};

// gets only the image from db
ShowsomeDb.prototype.getPhoto = function(id, callback) {
    this.getCollectionTurnInfoG(function(error, turnInfoG_collection) {
      if( error ) callback(error)
      else {
        turnInfoG_collection.find( {'gameID': id}, { gameID: '0', word: '0', photo: '1', triesLeft: '0' } ).toArray(function(error, result) {
          if(error) callback(error)
          else callback(null, result[0])
        }); 
      }
    });
};

// updates the turn information with the word given
ShowsomeDb.prototype.updateChosenWord = function(gameid, word, callback) {
    this.getCollectionTurnInfoR(function(error, turnInfoR_collection) {
      if( error ) callback(error)
      else {
        turnInfoR_collection.update({'gameID': gameid}, {$set: {'chosenWord': word}});
		callback(null, word);
      }
    });
};

// updates  and returns number of tries left
ShowsomeDb.prototype.updateTriesLeft = function(gameid, callback) {
    this.getCollectionTurnInfoG(function(error, turnInfoG_collection) {
      if( error ) callback(false)
      else {
		
		turnInfoG_collection.find( {'gameID': gameid} ).toArray(function(error, result) {
          if(error) {callback(error);}
          else {
			
			// number of tries left after this wrong guess
			tries = result[0].triesLeft - 1;
			console.log(tries);
			turnInfoG_collection.update({'gameID': gameid}, {$set: {'triesLeft': tries}});
			callback(null, String(tries));
		  
		  }
        }); 
 
      }
    });
};

// updates the game state to "state"
ShowsomeDb.prototype.updateGameState = function(gameid, newRole, next, callback) {
    this.getCollection(function(error, games_collection) {
      if( error ) callback(error)
      else {
	  
        games_collection.update({_id: ObjectID(gameid)}, {$set: {'role': newRole}});
		
		// if next player changes (riddler finished his move)
		if (next == true) {
			games_collection.find({_id: ObjectID(gameid)}).toArray(function(error, result) {
				if(error) callback(error)
				else {
				newNext = 1 - result[0].next;
				games_collection.update({_id: ObjectID(gameid)}, {$set: {'next': newNext}});
				}
			});
		}
		callback(null, 'true');
      }
    });
};

// deletes a turnInfoR from db
ShowsomeDb.prototype.deleteTurnInfoR = function (gameid, callback) {
	this.getCollectionTurnInfoR(function(error, turnInfoR_collection) {
      if( error ) {callback(false);}
      else {
        turnInfoR_collection.remove({'gameID': gameid});
		callback(true);
      }
    });
};

// deletes turninfoG from db
ShowsomeDb.prototype.deleteTurnInfoG = function (gameid, callback) {
	this.getCollectionTurnInfoG(function(error, turnInfoG_collection) {
      if( error ) {callback(false);}
      else {
        turnInfoG_collection.remove({'gameID': gameid});
		callback(true);
      }
    });
};

// deletes a game instance from db
ShowsomeDb.prototype.deleteGame = function (gameid, callback) {
	
	this.getCollection(function(error, games_collection) {
      if( error ) callback(false)
      else {
	  
		// case one game was chosen for deletion
		if (gameid == 'all') {
			games_collection.remove();
		} else {
			games_collection.remove({_id: ObjectID(gameid)});
		}
		callback(true);
      }
    });
}

exports.ShowsomeDb = ShowsomeDb;

