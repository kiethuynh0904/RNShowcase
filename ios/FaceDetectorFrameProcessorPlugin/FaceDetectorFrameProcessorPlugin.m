#import <VisionCamera/FrameProcessorPlugin.h>
#import <VisionCamera/FrameProcessorPluginRegistry.h>

#if __has_include("RNShowcase/RNShowcase-Swift.h")
#import "RNShowcase/RNShowcase-Swift.h"
#else
#import "RNShowcase-Swift.h"
#endif

VISION_EXPORT_SWIFT_FRAME_PROCESSOR(FaceDetectorFrameProcessorPluginPlugin, detectFace)
