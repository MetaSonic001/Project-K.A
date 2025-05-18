import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, { 
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

interface LineChartProps {
  data: {
    labels: string[];
    datasets: {
      data: number[];
    }[];
  };
}

export function LineChart({ data }: LineChartProps) {
  const maxValue = Math.max(...data.datasets[0].data);
  const minValue = Math.min(...data.datasets[0].data);
  
  return (
    <View style={styles.container}>
      <View style={styles.chart}>
        {data.datasets[0].data.map((value, index) => {
          const height = ((value - minValue) / (maxValue - minValue)) * 150;
          
          return (
            <View key={index} style={styles.barContainer}>
              <Animated.View style={[styles.bar, { height }]}>
                <LinearGradient
                  colors={['#3B82F6', '#6366F1']}
                  style={StyleSheet.absoluteFill}
                />
              </Animated.View>
              <Text style={styles.label}>{data.labels[index]}</Text>
              <Text style={styles.value}>{value}{data.labels[index] === 'Sun' ? 'g' : ''}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 200,
    paddingHorizontal: 8,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    width: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  label: {
    marginTop: 8,
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#64748B',
  },
  value: {
    marginTop: 4,
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#0F172A',
  },
});