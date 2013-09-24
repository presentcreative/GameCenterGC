var GameCenterPlugin = Class(function () {
	var onSuccessAchievements = [];
	var onFailAchievements = [];
	var onSuccessScores = [];
	var onFailScores = [];

    NATIVE.events.registerHandler('gameCenterPlugin', function(e) {
		console.log("{GameCenterJS} received return event");
		if (e.method == "checkAvailability") {
			if(e.isAvailable == true)
				console.log("{GameCenterJS} GameCenter Available");
			else
				console.log("{GameCenterJS} GameCenter NOT Available");
			GLOBAL.GameCenterAvailable = e.isAvailable;
		}
		if (e.method == "getScore") {
			//Edit here to utilize PN dictionary data
			var input =JSON.parse(JSON.stringify(e));
			console.log("{GameCenterJS} GC received score "+JSON.stringify(e, null, 4));
			//objImport(input.scores,onSuccessScores);
			for(var i in e.scores) {
			 	onSuccessScores[i] = e.scores[i];
				console.log("{GameCenterJS} GC added score "+i+":"+onSuccessScores[i]);			 	
			 }
//			console.log("{GameCenterJS} GC added score "+JSON.stringify(onSuccessScores, null, 4));
		}
		if (e.method == "getAchievement") {
			//Edit here to utilize PN dictionary data
			var input =JSON.parse(JSON.stringify(e));
			console.log("{GameCenterJS} GC received achievement "+JSON.stringify(e, null, 4));
			//objImport(input.achievements,onSuccessAchievements);
			for(var i in e.achievements) { onSuccessAchievements[i] = e.achievements[i]; }
			for(var i in e.achievements) {
			 	onSuccessAchievements[i] = e.achievements[i];
				console.log("{GameCenterJS} GC added achievement "+i+":"+onSuccessAchievements[i]);			 	
			 }
		}
	});

	this.checkAvailable = function() {	
		console.log("{GameCenterJS} checking GameCenter Availability");
		var e = {method:"checkAvailable"}
		
		NATIVE.plugins.sendEvent("GameCenterPlugin", "onRequest", JSON.stringify(e));
	}
	this.reportScore = function(aField,aValue) {	
		console.log("{GameCenterJS} Reporting GameCenter Score");
		var e = {method:"reportScore",field:aField,value:aValue}
		NATIVE.plugins.sendEvent("GameCenterPlugin", "onRequest", JSON.stringify(e));
	}
	this.reportAchievement = function(aField,aValue) {	
		console.log("{GameCenterJS} Reporting GameCenter Achievement");
		var e = {method:"reportAchievement",field:aField,value:aValue}
		NATIVE.plugins.sendEvent("GameCenterPlugin", "onRequest", JSON.stringify(e));
	}
	this.getHighScore = function(aField) {	
		console.log("{GameCenterJS} Getting GameCenter Score");
		var e = {method:"getHighScore",field:aField}
		NATIVE.plugins.sendEvent("GameCenterPlugin", "onRequest", JSON.stringify(e));
	}
	this.getAchievement = function(aField) {	
		console.log("{GameCenterJS} Getting GameCenter Achievement");
		var e = {method:"getAchievement",field:aField}
		NATIVE.plugins.sendEvent("GameCenterPlugin", "onRequest", JSON.stringify(e));
	}
	this.resetAchievements = function() {	
		console.log("{GameCenterJS} Resetting GameCenter Achievements");
		var e = {method:"resetAchievements"}
		NATIVE.plugins.sendEvent("GameCenterPlugin", "onRequest", JSON.stringify(e));
	}
	
	this.getHighScore("single_game_score");
	this.getAchievement("open_game");
	this.reportScore("single_game_score", "1");
	this.reportAchievement("open_game","100");
	
	function objImport(obj,copy) {
		if (null == obj || "object" != typeof obj) return obj;
		for (var attr in obj) {
			if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
		}
	}

});

exports = new GameCenterPlugin();