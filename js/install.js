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
	
// public method for decoding
// 	decode : function (input) {
// 		var output = "";
// 		var chr1, chr2, chr3;
// 		var enc1, enc2, enc3, enc4;
// 		var i = 0;
// 		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
// 		while (i < input.length) {
// 			enc1 = this._keyStr.indexOf(input.charAt(i++));
// 			enc2 = this._keyStr.indexOf(input.charAt(i++));
// 			enc3 = this._keyStr.indexOf(input.charAt(i++));
// 			enc4 = this._keyStr.indexOf(input.charAt(i++));
// 			chr1 = (enc1 << 2) | (enc2 >> 4);
// 			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
// 			chr3 = ((enc3 & 3) << 6) | enc4;
// 			output = output + String.fromCharCode(chr1);
// 			if (enc3 != 64) {
// 				output = output + String.fromCharCode(chr2);
// 			}
// 			if (enc4 != 64) {
// 				output = output + String.fromCharCode(chr3);
// 			}
// 		}
// 		output = this._utf8_decode(output);
// 		return output;
// 	},
//  
// private method for UTF-8 decoding
// 	_utf8_decode : function (utftext) {
// 		var string = "";
// 		var i = 0;
// 		var c = c1 = c2 = 0;
// 		while ( i < utftext.length ) {
// 			c = utftext.charCodeAt(i);
// 			if (c < 128) {
// 				string += String.fromCharCode(c);
// 				i++;
// 			}
// 			else if((c > 191) && (c < 224)) {
// 				c2 = utftext.charCodeAt(i+1);
// 				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
// 				i += 2;
// 			}
// 			else {
// 				c2 = utftext.charCodeAt(i+1);
// 				c3 = utftext.charCodeAt(i+2);
// 				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
// 				i += 3;
// 			}
// 		}
// 		return string;
// 	}

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