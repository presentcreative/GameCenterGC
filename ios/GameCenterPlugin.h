#import "PluginManager.h"

@interface GameCenterPlugin : GCPlugin {
    int64_t myScore;
    NSMutableDictionary *playerScores;
    NSString* token;
}

@property (nonatomic, retain) NSString* token;

+ (GameCenterPlugin*) get;
- (void) onRequest:(NSDictionary *)jsonObject;

@end