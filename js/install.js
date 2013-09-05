var PushNotificationPlugin = Class(function () {
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
			console.log("{GameCenterJS} GC received score "+JSON.stringify(e.s));
		}
	});

	this.checkAvailable = function() {	
		console.log("{GameCenterJS} checking GameCenter Availability");
		var e = {method:"checkAvailable",field:"getAchievement",value:"getAchievement"}
		NATIVE.plugins.sendEvent("GameCenterPlugin", "onRequest", JSON.stringify(e));
	}
	this.reportScore = function() {	
		console.log("{GameCenterJS} Reporting GameCenter Score");
		var e = {method:"reportScore",field:"getAchievement",value:"getAchievement"}
		NATIVE.plugins.sendEvent("GameCenterPlugin", "onRequest", JSON.stringify(e));
	}
	this.reportAchievement = function() {	
		console.log("{GameCenterJS} Reporting GameCenter Achievement");
		var e = {method:"reportAchievement",field:"getAchievement",value:"getAchievement"}
		NATIVE.plugins.sendEvent("GameCenterPlugin", "onRequest", JSON.stringify(e));
	}
	this.getHighScore = function() {	
		console.log("{GameCenterJS} Getting GameCenter Score");
		var e = {method:"getHighScore"}
		var e = {method:"getHighScore",field:"getAchievement"}
		NATIVE.plugins.sendEvent("GameCenterPlugin", "onRequest", JSON.stringify(e));
	}
	this.getAchievement = function() {	
		console.log("{GameCenterJS} Getting GameCenter Achievement");
		var e = {method:"getAchievement",field:"getAchievement"}
		NATIVE.plugins.sendEvent("GameCenterPlugin", "onRequest", JSON.stringify(e));
	}
	this.resetAchievements = function() {	
		console.log("{GameCenterJS} Resetting GameCenter Achievements");
		var e = {method:"resetAchievements"}
		NATIVE.plugins.sendEvent("GameCenterPlugin", "onRequest", JSON.stringify(e));
	}
});

exports = new GameCenterPlugin();