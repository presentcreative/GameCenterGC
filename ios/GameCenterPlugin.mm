#import "GameCenterPlugin.h"
#import "GameCenterManager.h`"


static GameCenterPlugin* instance = nil;

@implementation GameCenterPlugin

@synthesize token;

+ (GameCenterPlugin*) get {
	if (!instance) {
		instance = [[GameCenterPlugin alloc] init];
	}
    
	return instance;
}

// The plugin must call super dealloc.
- (void) dealloc {
	[super dealloc];
}

// The plugin must call super init.
- (id) init {
	self = [super init];
	if (!self) {
		return nil;
	}
	[[GameCenterManager sharedManager] initGameCenter];
	//kGameCenterManagerAvailabilityNotification
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(scoreReported:)		 name:kGameCenterManagerReportScoreNotification object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(achievementsReported:) name:kGameCenterManagerReportAchievementNotification object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(achievementsReset:)	 name:kGameCenterManagerResetAchievementNotification object:nil];

	return self;
}

- (void) initializeWithManifest:(NSDictionary *)manifest appDelegate:(TeaLeafAppDelegate *)appDelegate {
	NSLOG(@"{gameCenterPlugin} Initialized with manifest");
}

- (void) onRequest:(NSDictionary *)jsonObject {
	@try {
		NSLOG(@"{gameCenterPlugin} Got request");
        
		NSString *method = [jsonObject valueForKey:@"method"];
		}        
		if ([method isEqualToString:@"checkAvailable"]) {
			[self checkGCavailability];
		}        
		if ([method isEqualToString:@"reportScore"]) {
			NSLOG(@"{gameCenterPlugin} reporting score:%@ - %@",[jsonObject objectForKey:@"field"],[jsonObject objectForKey:@"value"]);
			[self reportScore:[jsonObject objectForKey:@"field"] value:[jsonObject objectForKey:@"value"]];
		}        
		if ([method isEqualToString:@"reportAchievement"]) {
			NSLOG(@"{gameCenterPlugin} reporting achievement:%@ - %@",[jsonObject objectForKey:@"field"],[jsonObject objectForKey:@"value"]);
			[self reportAchievement:[jsonObject objectForKey:@"field"] value:[jsonObject objectForKey:@"value"]];
		}        
		if ([method isEqualToString:@"getHighScore"]) {
			NSLOG(@"{gameCenterPlugin} getting score:%@",[jsonObject objectForKey:@"field"]);
			[self getHighScore:[jsonObject objectForKey:@"field"]];
		}        
		if ([method isEqualToString:@"getAchievement"]) {
			NSLOG(@"{gameCenterPlugin} checking achievement:%@",[jsonObject objectForKey:@"field"]);
			[self getAchievementProgress:[jsonObject objectForKey:@"field"]];
		}
		if ([method isEqualToString:@"resetAchievements"]) {
			NSLOG(@"{gameCenterPlugin} Clearing Achievements");
			[self resetAchievement];
		}
	}
	@catch (NSException *exception) {
		NSLOG(@"{gameCenterPlugin} Exception while processing event: ", exception);
	}
}

- (void) checkGCavailability {
	[[PluginManager get] dispatchJSEvent:[NSDictionary dictionaryWithObjectsAndKeys:
		  @"gameCenterPlugin",@"name",
		  @"checkAvailability", @"method",
		  [[GameCenterManager sharedManager] isGameCenterAvailable],@"isAvailable", nil]];
}

- (void) reportScore:(NSString*)field value:(int):value {
	 [[GameCenterManager sharedManager] saveAndReportScore:value leaderboard:field];
}

- (void) reportAchievement:(NSString*)field value:(int):value {
	[[GameCenterManager sharedManager] saveAndReportAchievement:field percentComplete:value];
}

- (void) getHighScore:(NSString*)field {
	//Array of leaderboard ID's to get high scores for
    NSArray *leaderboardIDs = [NSArray arrayWithObjects:field, nil];

    //Returns a dictionary with leaderboard ID's as keys and high scores as values
	NSDictionary* scoreDict = [[GameCenterManager defaultManager] highScoreForLeaderboards:leaderboardIDs];

	[[PluginManager get] dispatchJSEvent:[NSDictionary dictionaryWithObjectsAndKeys:
		  @"gameCenterPlugin",@"name",
		  @"getScore", @"method",
		  scoreDict,@"scores", nil]];
}

- (void) getAchievementProgress:(NSString*)field {
	//Array of achievement ID's to get progress for
    NSArray *achievementIDs = [NSArray arrayWithObjects:field, nil];

    //Returns a dictionary with achievement ID's as keys and progress as values
	NSDictionary* achDict = [[GameCenterManager defaultManager] progressForAchievements:achievementIDs];
    
	[[PluginManager get] dispatchJSEvent:[NSDictionary dictionaryWithObjectsAndKeys:
		  @"gameCenterPlugin",@"name",
		  @"getAchievement", @"method",
		  achDict,@"achievements", nil]];
}

- (void) resetAchievement {
	[[GameCenterManager sharedManager] resetAchievements];
}

- (void) scoreReported:(NSNotification*)notification  {
	[[PluginManager get] dispatchJSEvent:[NSDictionary dictionaryWithObjectsAndKeys:
		  @"gameCenterPlugin",@"name",
		  @"scoreReported", @"method",
		  [notification userInfo],@"userInfo", nil]];
}

- (void) achievementsReported:(NSNotification*)notification  {
	[[PluginManager get] dispatchJSEvent:[NSDictionary dictionaryWithObjectsAndKeys:
		  @"gameCenterPlugin",@"name",
		  @"achievementReported", @"method",
		  [notification userInfo],@"userInfo", nil]];
}

- (void) achievementsReset:(NSNotification*)notification  {
	[[PluginManager get] dispatchJSEvent:[NSDictionary dictionaryWithObjectsAndKeys:
		  @"gameCenterPlugin",@"name",
		  @"achievementReset", @"method",
		  [notification userInfo],@"userInfo", nil]];
}

@end