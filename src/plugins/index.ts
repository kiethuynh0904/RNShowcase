import { Frame, VisionCameraProxy } from 'react-native-vision-camera';

const plugin = VisionCameraProxy.initFrameProcessorPlugin('detectFace', {});

type Point = {
  x: number;
  y: number;
};

export type Contours = {
  FACE?: Point[];
  LEFT_CHEEK?: Point[];
  RIGHT_CHEEK?: Point[];
  [key: string]: Point[] | undefined;
};

export type Face = {
  x: number;
  y: number;
  width: number;
  height: number;
  contours?: Contours;
};

export function detectFace(frame: Frame): Face[] {
  'worklet';
  if (plugin == null)
    throw new Error('Failed to load Frame Processor Plugin "scanFaces"!');
  return plugin.call(frame) as unknown as Face[];
}
