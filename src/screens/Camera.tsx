import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import {
  Templates,
  Camera as VisionCamera,
  useCameraDevice,
  useCameraFormat,
  useCameraPermission,
} from 'react-native-vision-camera';

export default function Camera() {
  const device = useCameraDevice('back');
  const format = useCameraFormat(device, Templates.Snapchat);

  const { hasPermission, requestPermission } = useCameraPermission();
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
    <VisionCamera
      style={StyleSheet.absoluteFill}
      device={device}
      isActive={true}
      format={format}
    />
  );
}
