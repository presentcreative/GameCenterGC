#import "PluginManager.h"

@interface GameCenterPlugin : GCPlugin {
}

@property (nonatomic, retain) NSString* token;

+ (GameCenterPlugin*) get;
- (void) onRequest:(NSDictionary *)jsonObject;

@end