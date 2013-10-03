var GameCenterPlugin = Class(function () {
	var onSuccessAchievements = [];
	var onFailAchievements = [];
	var onSuccessScores = [];
	var onFailScores = [];
	var FriendScores = [];
	var FriendList = [];

    NATIVE.events.registerHandler('gameCenterPlugin', function(e) {
		console.log("{GameCenterJS} received return event");
		if (e.method == "checkAvailability") {
			if(e.isAvailable == true)
				console.log("{GameCenterJS} GameCenter Available");
			else
				console.log("{GameCenterJS} GameCenter NOT Available");
			GLOBAL.GameCenterAvailable = e.isAvailable;
		}
		if (e.method == "gotScore") {
			//Edit here to utilize PN dictionary data
			console.log("{GameCenterJS} GC received score "+JSON.stringify(e, null, 4));
			GC.app.stack.getCurrentView().emit("receivedGCScores");	
			for(var i in e.scores) {
			 	onSuccessScores[i] = e.scores[i];
				console.log("{GameCenterJS} GC added score "+i+":"+onSuccessScores[i]);			 	
			 }
//			console.log("{GameCenterJS} GC added score "+JSON.stringify(onSuccessScores, null, 4));
		}
		if (e.method == "gotAchievement") {
			//Edit here to utilize PN dictionary data
			console.log("{GameCenterJS} GC received achievement "+JSON.stringify(e, null, 4));
			GC.app.stack.getCurrentView().emit("receivedGCAchievement");	
			for(var i in e.achievements) {
				onSuccessAchievements[i] = e.achievements[i];
				console.log("{GameCenterJS} GC added achievement "+i+":"+onSuccessAchievements[i]);			 	
			 }
		}
		if (e.method == "gotFriendList") {
			console.log("{GameCenterJS} GC received friend list ");
			GC.app.stack.getCurrentView().emit("receivedGCFriendList");	
			for(var i in e.friends) {
				FriendList[i] = e.friends[i];
				this.getFriendImage(e.friends[i],true);
				this.getFriendImage(e.friends[i],false);
				console.log("{GameCenterJS} GC added friend "+FriendList[i]);			 	
			 }
		}
		if (e.method == "gotFriendScores") {
			console.log("{GameCenterJS} GC received friend scores "+JSON.stringify(e, null, 4));
			GC.app.stack.getCurrentView().emit("receivedGCFriendScores");	
			FriendScores[e.scoreboard] = [];
			for(var i in e.scores) {
				FriendScores[e.scoreboard][i] = e.scores[i];
				console.log("{GameCenterJS} GC added friend score "+e.scoreboard+":"+i+":"+FriendScores[e.scoreboard][i]);			 	
			 }
		}
	});

	this.checkAvailable = function() {	
		console.log("{GameCenterJS} checking GameCenter Availability");
		var e = {method:"checkAvailable"};	
		NATIVE.plugins.sendEvent("GameCenterPlugin", "onRequest", JSON.stringify(e));
	}
	this.getFriendList = function() {	
		console.log("{GameCenterJS} getting Friend List");
		var e = {method:"getFriendList"};	
		NATIVE.plugins.sendEvent("GameCenterPlugin", "onRequest", JSON.stringify(e));
	}
	this.reportScore = function(aField,aValue) {	
		console.log("{GameCenterJS} Reporting GameCenter Score");
		var e = {method:"reportScore",field:aField,value:aValue}
		NATIVE.plugins.sendEvent("GameCenterPlugin", "onRequest", JSON.stringify(e));
	}
	this.getFriendImage = function(aPlayerID, getSmallImage) {	
		console.log("{GameCenterJS} getting Friend Image");
		var e = {method:"getFriendList", playerID:aPlayerID, getSmall:getSmallImage};	
		NATIVE.plugins.sendEvent("GameCenterPlugin", "onRequest", JSON.stringify(e));
	}
	this.reportAchievement = function(aField,aValue) {	
		console.log("{GameCenterJS} Reporting GameCenter Achievement");
		var e = {method:"reportAchievement",field:aField,value:aValue};
		NATIVE.plugins.sendEvent("GameCenterPlugin", "onRequest", JSON.stringify(e));
	}
	this.sendChallenge = function(aScoreboard,myPlayers,aScore,aMessage) {	
		console.log("{GameCenterJS} Getting GameCenter Score");
		var e = {method:"getHighScore",scoreboard:aScoreboard,players:myPlayers,score:aScore,message:aMessage};
		NATIVE.plugins.sendEvent("GameCenterPlugin", "onRequest", JSON.stringify(e));
	}
	this.getHighScore = function(aField) {	
		console.log("{GameCenterJS} Getting GameCenter Score");
		var e = {method:"getHighScore",field:aField};
		NATIVE.plugins.sendEvent("GameCenterPlugin", "onRequest", JSON.stringify(e));
	}
	this.getFriendScores = function(aField) {	
		console.log("{GameCenterJS} Getting GameCenter Friend Scores");
		var e = {method:"getFriendScores",field:aField};
		NATIVE.plugins.sendEvent("GameCenterPlugin", "onRequest", JSON.stringify(e));
	}
	this.getAchievement = function(aField) {	
		console.log("{GameCenterJS} Getting GameCenter Achievement");
		var e = {method:"getAchievement",field:aField};
		NATIVE.plugins.sendEvent("GameCenterPlugin", "onRequest", JSON.stringify(e));
	}
	this.resetAchievements = function() {	
		console.log("{GameCenterJS} Resetting GameCenter Achievements");
		var e = {method:"resetAchievements"}
		NATIVE.plugins.sendEvent("GameCenterPlugin", "onRequest", JSON.stringify(e));
	}
	
	//Test function calls
	this.reportScore("single_game_score", "2");
	this.reportAchievement("open_game","100");
	this.getFriendList();
// 	this.resetAchievements();
// 	this.getHighScore("single_game_score");
// 	this.getAchievement("open_game");
	this.getFriendScores("single_game_score");
});

exports = new GameCenterPlugin();