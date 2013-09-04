var PushNotificationPlugin = Class(function () {
    NATIVE.events.registerHandler('gameCenterPlugin', function(e) {
		console.log("{GameCenterJS} received return event");
		if (e.method == "setToken") {
			console.log("{GameCenterJS} GC received token: "+e.token);
			GLOBAL.pushToken = e.token;
		}
		if (e.method == "handleURL") {
			//Edit here to utilize PN dictionary data
			console.log("{GameCenterJS} GC received notification - "+JSON.stringify(e));
		}
	});

	//plugins.gameCenterPlugin.clearBadge
	this.clearBadge = function() {	
		console.log("{GameCenterJS} Requesting Badge Clear");
		var e = {method:"clearBadge"}
		NATIVE.plugins.sendEvent("GameCenterPlugin", "onRequest", JSON.stringify(e));
	}
});

exports = new GameCenterPlugin();