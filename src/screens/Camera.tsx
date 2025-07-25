import { Contours, detectFace } from '@/plugins';
import {
  Canvas,
  ClipOp,
  PaintStyle,
  Path,
  Skia,
  TextPath,
  TileMode,
  useFont,
} from '@shopify/react-native-skia';
import React, { useCallback, useState } from 'react';
import { Button, Dimensions, StyleSheet, Text, View } from 'react-native';
import {
  CameraPosition,
  Templates,
  Camera as VisionCamera,
  useCameraDevice,
  useCameraFormat,
  useCameraPermission,
  useFrameProcessor,
  useSkiaFrameProcessor,
} from 'react-native-vision-camera';

export default function Camera() {
  const [position, setPosition] = useState<CameraPosition>('front');

  const device = useCameraDevice(position);
  const format = useCameraFormat(device, [
    { videoResolution: Dimensions.get('window') },
    {
      fps: 60,
    },
  ]);

  const { hasPermission, requestPermission } = useCameraPermission();

  const blurRadius = 25;
  const blurFilter = Skia.ImageFilter.MakeBlur(
    blurRadius,
    blurRadius,
    TileMode.Repeat,
    null,
  );
  const paint = Skia.Paint();
  paint.setImageFilter(blurFilter);

  const frameProcessor = useSkiaFrameProcessor(frame => {
    'worklet';
    frame.render();
    // console.log('frame', frame);
    const faces = detectFace(frame);
    const paintDebugMap: Record<keyof Contours, any> = {
      FACE: Skia.Paint(),
      LEFT_CHEEK: Skia.Paint(),
      RIGHT_CHEEK: Skia.Paint(),
    };

    paintDebugMap.FACE.setColor(Skia.Color('blue'));
    paintDebugMap.LEFT_CHEEK.setColor(Skia.Color('green'));
    paintDebugMap.RIGHT_CHEEK.setColor(Skia.Color('orange'));

    for (const key in paintDebugMap) {
      paintDebugMap[key].setStyle(PaintStyle.Stroke);
      paintDebugMap[key].setStrokeWidth(3);
    }

    for (const face of faces) {
      if (face.contours != null) {
        const necessaryContours: (keyof Contours)[] = [
          'FACE',
          'LEFT_CHEEK',
          'RIGHT_CHEEK',
        ];
        for (const key of necessaryContours) {
          const points = face.contours[key];
          const path = Skia.Path.Make();

          points?.forEach((point, index) => {
            if (index === 0) {
              // it's a starting point
              path.moveTo(point.x, point.y);
            } else {
              // it's a continuation
              path.lineTo(point.x, point.y);
            }
          });
          path.close();
          // fullPath.addPath(path);
          // use for debugging
          frame.drawPath(path, paintDebugMap[key]);
        }
        frame.save();
        // frame.clipPath(fullPath, ClipOp.Intersect, true);
        // frame.render(paint);
        frame.restore();
      }
      console.log(`Faces in Frame: ${JSON.stringify(faces)}`);
    }
  }, []);

  const flipCamera = useCallback(() => {
    setPosition(pos => (pos === 'front' ? 'back' : 'front'));
  }, []);

  if (!hasPermission) {
    return (
      <View>
        <Text>No permission</Text>
        <Button title="Request permission" onPress={requestPermission} />
      </View>
    );
  }

  if (device == null) return <Text>No camera found</Text>;
  return (
    <View style={styles.container} onTouchEnd={flipCamera}>
      <VisionCamera
        style={{ flex: 1 }}
        frameProcessor={frameProcessor}
        device={device}
        isActive={true}
        format={format}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
