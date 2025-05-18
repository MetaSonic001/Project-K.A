import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';

interface AppLoadingProps {
  message?: string;
}

export function AppLoading({ message = 'Loading...' }: AppLoadingProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#3B82F6" />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748B',
    fontWeight: '500',
  },
});