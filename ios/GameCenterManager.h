//
//  GameCenterManager.h
//
//  Created by Nihal Ahmed on 12-03-16.
//  Copyright (c) 2012 NABZ Software. All rights reserved.
//
//  Modified by John Wilson on 9-24-13.

// Change this value to your own secret key
#define kGameCenterManagerKey [@"Replace This Key" dataUsingEncoding:NSUTF8StringEncoding]
#define LIBRARY_FOLDER [NSHomeDirectory() stringByAppendingPathComponent:@"Library"]
#define kGameCenterManagerDataFile @"GameCenterManager.plist"
#define kGameCenterManagerDataPath [LIBRARY_FOLDER stringByAppendingPathComponent:kGameCenterManagerDataFile]
#define kGameCenterManagerAvailabilityNotification @"GameCenterManagerAvailabilityNotification"
#define kGameCenterManagerReportScoreNotification @"GameCenterManagerReportScoreNotification"
#define kGameCenterManagerReportAchievementNotification @"GameCenterManagerReportAchievementNotification"
#define kGameCenterManagerResetAchievementNotification @"GameCenterManagerResetAchievementNotification"
#define kGameCenterManagerReceivedFriendListNotification @"GameCenterManagerReceivedFriendListNotification"
#define kGameCenterManagerReceivedFriendScoreNotification @"GameCenterManagerReceivedPlayersNotification"
#define kGameCenterManagerReceivedPlayerInfoNotification @"GameCenterManagerReceivedPlayerInfoNotification"
#define kGameCenterManagerReceivedFriendPhotoNotification @"GameCenterManagerReceivedFriendPhotoNotification"

#import <Foundation/Foundation.h>
#import <GameKit/GameKit.h>
#import "Reachability.h"
#import "NSDataAES256.h"

@interface GameCenterManager : NSObject {
    NSMutableArray *_leaderboards;
}

// Use this property to check if Game Center is available and supported on the current device.
@property (nonatomic, assign)    BOOL isGameCenterAvailable;
@property (nonatomic, readwrite) BOOL includeLocalPlayerScore;

// Returns the shared instance of GameCenterManager.
+ (GameCenterManager *)sharedManager;

// Initializes Game Center Manager. Should be called at app launch.
- (void)initGameCenter;

// Synchronizes local player data with Game Center data.
- (void)syncGameCenter;

// Saves score locally and reports it to Game Center. If error occurs, score is saved to be submitted later.
- (void)saveAndReportScore:(int)score leaderboard:(NSString *)identifier;

// Saves achievement locally and reports it to Game Center. If error occurs, achievement is saved to be submitted later.
- (void)saveAndReportAchievement:(NSString *)identifier percentComplete:(double)percentComplete;

// Reports scores and achievements which could not be reported earlier.
- (void)reportSavedScoresAndAchievements;

// Saves score to be submitted later.
- (void)saveScoreToReportLater:(GKScore *)score;

// Saves achievement to be submitted later.
- (void)saveAchievementToReportLater:(NSString *)identifier percentComplete:(double)percentComplete;

// Returns local player's high score for specified leaderboard.
- (int)highScoreForLeaderboard:(NSString *)identifier;

// Returns local player's high scores for multiple leaderboards.
- (NSDictionary *)highScoreForLeaderboards:(NSArray *)identifiers;

// Returns local player's percent completed for specified achievement.
- (double)progressForAchievement:(NSString *)identifier;

// Returns local player's percent completed for multiple achievements.
- (NSDictionary *)progressForAchievements:(NSArray *)identifiers;

// Resets local player's achievements
- (void)resetAchievements;

// Returns currently authenticated local player. If no player is authenticated, "unknownPlayer" is returned.
- (NSString *)localPlayerId;

// Returns YES if an active internet connection is available.
- (BOOL)isInternetAvailable;

// Triggers GameCenterManagerReceivedFriendListNotification with an array of Players
-(void) getFriendList;

// Triggers kGameCenterManagerReceivedFriendScoreNotification with an array of Players
-(void)getFriendScoresForScoreBoard:(NSString*)scoreboard;

// Sends a challenge to players with the given message
-(void)sendScoreChallenge:(NSString*)challengeScoreboard ToPlayers:(NSArray*)players withScore:(int64_t)score message:(NSString*)message;

-(void)getPhotoForPlayer:(GKPlayer*)player small:(BOOL)small;
@end