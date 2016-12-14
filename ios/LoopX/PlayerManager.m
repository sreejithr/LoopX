//
//  PlayerManager.m
//  LoopX
//
//  Created by Sreejith on 12/11/16.
//  Copyright © 2016 Facebook. All rights reserved.
//

#import "PlayerManager.h"
#import "RCTLog.h"

@implementation PlayerManager

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(play:(NSString *)name location:(NSString *)location) {
  RCTLogInfo(@"Pretending to create an event %@ at %@", name, location);
}

@end
