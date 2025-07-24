import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { RootStackParamList } from '@/navigation/AppNavigator';
import { useNavigation } from '@react-navigation/native';

type Feature = {
  title: string;
  screen: keyof RootStackParamList;
};

const features: Feature[] = [
  {
    title: 'Camera',
    screen: 'Camera',
  },
];

export default function Home() {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <FlatList
        data={features}
        keyExtractor={item => item.screen}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate(item.screen)}>
            <Text style={styles.textLink}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  textLink: {
    fontSize: 16,
    marginBottom: 20,
  },
});
