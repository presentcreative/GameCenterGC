//hi
#import "GameCenterPlugin.h"
#import "GameCenterManager.h"
#import "Base64.h"

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
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onScoreReported:) name:kGameCenterManagerReportScoreNotification object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onAchievementsReported:) name:kGameCenterManagerReportAchievementNotification object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onAchievementsReset:) name:kGameCenterManagerResetAchievementNotification object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onFriendScoresReceived:) name:kGameCenterManagerReceivedFriendScoreNotification object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onFriendListReceived:) name:kGameCenterManagerReceivedFriendListNotification object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onPlayerScoreInfoReceived:) name:kGameCenterManagerReceivedPlayerInfoNotification object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onFriendImageReceived:) name:kGameCenterManagerReceivedFriendPhotoNotification object:nil];

	return self;
}

- (void) initializeWithManifest:(NSDictionary *)manifest appDelegate:(TeaLeafAppDelegate *)appDelegate {
	NSLOG(@"{gameCenterPlugin} Initialized with manifest");
}

- (void) onRequest:(NSDictionary *)jsonObject {
	@try {
		NSLOG(@"{gameCenterPlugin} Got request");
        
		NSString *method = [jsonObject valueForKey:@"method"];

		if ([method isEqualToString:@"checkAvailable"]) {
			[self checkGCavailability];
		}        
		else if ([method isEqualToString:@"reportScore"]) {
			NSLOG(@"{gameCenterPlugin} reporting score:%@ - %@",[jsonObject objectForKey:@"field"],[jsonObject objectForKey:@"value"]);
			[self reportScore:[jsonObject objectForKey:@"field"] value:[[jsonObject objectForKey:@"value"] intValue]];
		}
		else if ([method isEqualToString:@"reportAchievement"]) {
			NSLOG(@"{gameCenterPlugin} reporting achievement:%@ - %@",[jsonObject objectForKey:@"field"],[jsonObject objectForKey:@"value"]);
			[self reportAchievement:[jsonObject objectForKey:@"field"] value:[[jsonObject objectForKey:@"value"] intValue]];
		}        
		else if ([method isEqualToString:@"sendChallenge"]) {
			NSLOG(@"{gameCenterPlugin} reporting score:%@ - %@",[jsonObject objectForKey:@"field"],[jsonObject objectForKey:@"value"]);
            [[GameCenterManager sharedManager] sendScoreChallenge:[jsonObject objectForKey:@"scoreboard"] ToPlayers:[jsonObject objectForKey:@"friends"] withScore:[[jsonObject objectForKey:@"score"] intValue] message:[jsonObject objectForKey:@"message"]];
		}
		else if ([method isEqualToString:@"getFriendList"]) {
			NSLOG(@"{gameCenterPlugin} getting friend list");
			[[GameCenterManager sharedManager] getFriendList];
		}
		else if ([method isEqualToString:@"getFriendImage"]) {
			NSLOG(@"{gameCenterPlugin} getting friend image");
			[self getFriendImage:[jsonObject objectForKey:@"player"] smallSize:[[jsonObject objectForKey:@"getSmall"] boolValue]];
		}
		else if ([method isEqualToString:@"getHighScore"]) {
			NSLOG(@"{gameCenterPlugin} getting score:%@",[jsonObject objectForKey:@"field"]);
			[self getHighScore:[jsonObject objectForKey:@"field"]];
		}
		else if ([method isEqualToString:@"getFriendScores"]) {
			NSLOG(@"{gameCenterPlugin} getting friend scores:%@",[jsonObject objectForKey:@"field"]);
			[[GameCenterManager sharedManager] getFriendScoresForScoreBoard:[jsonObject objectForKey:@"field"]];
		}
		else if ([method isEqualToString:@"getAchievement"]) {
			NSLOG(@"{gameCenterPlugin} checking achievement:%@",[jsonObject objectForKey:@"field"]);
			[self getAchievementProgress:[jsonObject objectForKey:@"field"]];
		}
		else if ([method isEqualToString:@"resetAchievements"]) {
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

- (void) reportScore:(NSString*)field value:(int)value {
	 [[GameCenterManager sharedManager] saveAndReportScore:value leaderboard:field];
}

- (void) reportAchievement:(NSString*)field value:(int)value {
	[[GameCenterManager sharedManager] saveAndReportAchievement:field percentComplete:value];
}

- (void) getFriendImage:(NSString*)playerID smallSize:(BOOL)small {
    NSArray* playerList = [NSArray arrayWithObject:playerID];
    [GKPlayer loadPlayersForIdentifiers:playerList withCompletionHandler:^(NSArray *friends, NSError *error) {
        if (error != nil) {
            NSLog(@"{gameCenterPlugin}Error retrieving GC Friend for Image:%@",[error description]);
        }
        if (friends != nil) {
            [[GameCenterManager sharedManager] getPhotoForPlayer:[friends firstObject] small:small];
        }
    }];
}

- (void) getHighScore:(NSString*)field {
	//Array of leaderboard ID's to get high scores for
    NSArray *leaderboardIDs = [NSArray arrayWithObjects:field, nil];

    //Returns a dictionary with leaderboard ID's as keys and high scores as values
	NSDictionary* scoreDict = [[GameCenterManager sharedManager] highScoreForLeaderboards:leaderboardIDs];

	[[PluginManager get] dispatchJSEvent:[NSDictionary dictionaryWithObjectsAndKeys:
		  @"gameCenterPlugin",@"name",
		  @"gotScore", @"method",
		  scoreDict,@"scores", nil]];
}

- (void) getAchievementProgress:(NSString*)field {
	//Array of achievement ID's to get progress for
    NSArray *achievementIDs = [NSArray arrayWithObjects:field, nil];

    //Returns a dictionary with achievement ID's as keys and progress as values
	NSDictionary* achDict = [[GameCenterManager sharedManager] progressForAchievements:achievementIDs];
    
	[[PluginManager get] dispatchJSEvent:[NSDictionary dictionaryWithObjectsAndKeys:
		  @"gameCenterPlugin",@"name",
		  @"gotAchievement", @"method",
		  achDict,@"achievements", nil]];
}

- (void) resetAchievement {
	[[GameCenterManager sharedManager] resetAchievements];
}

- (void) onScoreReported:(NSNotification*)notification  {
	[[PluginManager get] dispatchJSEvent:[NSDictionary dictionaryWithObjectsAndKeys:
		  @"gameCenterPlugin",@"name",
		  @"scoreReported", @"method",
		  [notification userInfo],@"userInfo", nil]];
}

- (void) onAchievementsReported:(NSNotification*)notification {
	[[PluginManager get] dispatchJSEvent:[NSDictionary dictionaryWithObjectsAndKeys:
		  @"gameCenterPlugin",@"name",
		  @"achievementReported", @"method",
		  [notification userInfo],@"userInfo", nil]];
}

- (void) onAchievementsReset:(NSNotification*)notification {
	[[PluginManager get] dispatchJSEvent:[NSDictionary dictionaryWithObjectsAndKeys:
		  @"gameCenterPlugin",@"name",
		  @"achievementReset", @"method",
		  [notification userInfo],@"userInfo", nil]];
}

-(void)onFriendScoresReceived:(NSNotification*)notification {
    NSLog(@"{gameCenterPlugin} Returning Friends Scores");
	[[PluginManager get] dispatchJSEvent:[NSDictionary dictionaryWithObjectsAndKeys:
                                          @"gameCenterPlugin",@"name",
                                          @"gotFriendScores", @"method",
                                          [[notification userInfo] objectForKey:@"scoreboard"],@"scoreboard",
                                          [[notification userInfo] objectForKey:@"scores"],@"scores", nil]];
//    [scores enumerateObjectsUsingBlock: ^(id obj, NSUInteger idx, BOOL *stop){
//        GKScore *score = (GKScore*) obj;
//    }];
}

-(void) onPlayerScoreInfoReceived:(NSNotification*)notification {
    NSArray* players = [[notification userInfo] objectForKey:@"players"];
    [players enumerateObjectsUsingBlock:^(id obj, NSUInteger idx, BOOL *stop) {
        GKPlayer *player = (GKPlayer*)obj;
        
        //do something with player
        //		 if (playerScores[player.playerID] == nil) {
        //			 playerScores[player.playerID] = [NSMutableDictionary dictionary];
        //		 }
        //		 [playerScores[player.playerID] setObject:player forKey:kPlayerKey];
    }];
}

-(void) getFriendInfo:(NSArray*)playerList {
    if (![GameCenterManager sharedManager].isGameCenterAvailable)
        return;
    
    if ([playerList count] > 0) {
        [GKPlayer loadPlayersForIdentifiers:playerList withCompletionHandler:^(NSArray* friends, NSError* error) {
            NSDictionary* userInfo = [NSDictionary dictionaryWithObject:friends forKey:@"friends"];
            [[NSNotificationCenter defaultCenter] postNotificationName:kGameCenterManagerReceivedPlayerInfoNotification
                                                                object:[GameCenterManager sharedManager]
                                                              userInfo:userInfo];
        }];
    }
}

-(void) onFriendListReceived:(NSNotification*)notification {
    NSLog(@"{gameCenterPlugin} got Friend List");
    NSArray* identifiers = [[notification userInfo] objectForKey:@"friends"];

    [[PluginManager get] dispatchJSEvent:[NSDictionary dictionaryWithObjectsAndKeys:
                                          @"gameCenterPlugin",@"name",
                                          @"gotFriendList", @"method",
                                          [[notification userInfo] objectForKey:@"friends"],@"friends", nil]];

    [GKPlayer loadPlayersForIdentifiers:identifiers withCompletionHandler:^(NSArray *friends, NSError *error) {
        if (error != nil) {
            NSLog(@"{gameCenterPlugin} Error retrieving GC Friend List:%@",[error description]);
        }
        if (friends != nil) {
            NSLog(@"{gameCenterPlugin} Returning Friends List");
            int i = 1;
            [friends enumerateObjectsUsingBlock:^(id obj, NSUInteger idx, BOOL *stop) {
                GKPlayer *player = (GKPlayer*)obj;
                NSLog(@"{gameCenterPlugin} Player %i:%@",i,[player description]);
                [[GameCenterManager sharedManager] getPhotoForPlayer:player small:YES];
            }];

            [[PluginManager get] dispatchJSEvent:[NSDictionary dictionaryWithObjectsAndKeys:
                                                  @"gameCenterPlugin",@"name",
                                                  @"gotFriendList", @"method",
                                                  [[notification userInfo] objectForKey:@"friends"],@"friends", nil]];
        }
    }];
}

-(void) onFriendImageReceived:(NSNotification*)notification {
    NSLog(@"{gameCenterPlugin} Returning Friends Image");
    UIImage *image = [[notification userInfo] objectForKey:@"image"];
    NSData* data = UIImageJPEGRepresentation(image, 1.0f);
    [Base64 initialize];
    NSString *imageString = [Base64 encode:data];
    [[PluginManager get] dispatchJSEvent:[NSDictionary dictionaryWithObjectsAndKeys:
                                          @"gameCenterPlugin",@"name",
                                          @"gotFriendImage", @"method",
                                          [[notification userInfo] objectForKey:@"playerID"],@"playerID",
                                          imageString,@"imageString",nil]];
}

@end