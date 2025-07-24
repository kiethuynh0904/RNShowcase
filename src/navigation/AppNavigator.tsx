import * as React from 'react';
import {
  createStaticNavigation,
  StaticParamList,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Camera, Home } from '../screens';

const RootStack = createNativeStackNavigator({
  screens: {
    Home: Home,
    Camera: Camera,
  },
});

export type RootStackParamList = StaticParamList<typeof RootStack>;
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

const Navigation = createStaticNavigation(RootStack);

export default function AppNavigator() {
  return <Navigation />;
}
