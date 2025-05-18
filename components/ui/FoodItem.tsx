import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  withSpring, 
  interpolate,
  runOnJS
} from 'react-native-reanimated';
import { InventoryItem } from '@/hooks/useFirebaseInventory';

interface FoodItemProps {
  item: InventoryItem;
  onPress?: (item: InventoryItem) => void;
  expanded?: boolean;
}

export function FoodItem({ item, onPress, expanded = false }: FoodItemProps) {
  const expandProgress = useSharedValue(expanded ? 1 : 0);
  
  const handlePress = () => {
    expandProgress.value = withSpring(expandProgress.value === 0 ? 1 : 0, {
      damping: 12,
      stiffness: 120,
    });
    
    if (onPress) {
      onPress(item);
    }
  };
  
  const containerStyle = useAnimatedStyle(() => {
    return {
      height: interpolate(
        expandProgress.value,
        [0, 1],
        [100, 200]
      ),
    };
  });
  
  const imageStyle = useAnimatedStyle(() => {
    return {
      width: interpolate(
        expandProgress.value,
        [0, 1],
        [80, 120]
      ),
      height: interpolate(
        expandProgress.value,
        [0, 1],
        [80, 120]
      ),
    };
  });
  
  const detailsStyle = useAnimatedStyle(() => {
    return {
      opacity: expandProgress.value,
      height: interpolate(
        expandProgress.value,
        [0, 1],
        [0, 100]
      ),
      transform: [
        { 
          translateY: interpolate(
            expandProgress.value,
            [0, 1],
            [20, 0]
          )
        }
      ],
    };
  });
  
  const levelStyle = {
    width: `${Math.min(100, Math.max(0, item.foodLevel))}%`,
    backgroundColor: item.isLow ? '#EF4444' : '#22C55E',
  };

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={handlePress}>
      <Animated.View style={[styles.container, containerStyle]}>
        <View style={styles.header}>
          <Animated.View style={[styles.imageContainer, imageStyle]}>
            <Image
              source={{ uri: item.image }}
              style={styles.image}
              contentFit="cover"
              transition={200}
            />
          </Animated.View>
          
          <View style={styles.info}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.category}>{item.category}</Text>
            
            <View style={styles.levelContainer}>
              <View style={styles.levelBackground}>
                <View style={[styles.levelFill, levelStyle]} />
              </View>
              <Text style={styles.quantity}>
                {item.weight}{item.unit} left
              </Text>
            </View>
          </View>
        </View>
        
        <Animated.View style={[styles.details, detailsStyle]}>
          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Last Updated</Text>
              <Text style={styles.detailValue}>
                {new Date(item.timestamp).toLocaleTimeString()}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Threshold</Text>
              <Text style={styles.detailValue}>{item.threshold}{item.unit}</Text>
            </View>
          </View>
          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Status</Text>
              <Text style={[
                styles.detailValue, 
                item.isLow ? styles.lowStock : styles.inStock
              ]}>
                {item.isLow ? 'Low Stock' : 'In Stock'}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Poll Rate</Text>
              <Text style={styles.detailValue}>{item.interval / 1000}s</Text>
            </View>
          </View>
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F1F5F9',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  info: {
    flex: 1,
    marginLeft: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
  },
  levelContainer: {
    width: '100%',
  },
  levelBackground: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  levelFill: {
    height: '100%',
    borderRadius: 4,
  },
  quantity: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  details: {
    marginTop: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '500',
  },
  lowStock: {
    color: '#EF4444',
  },
  inStock: {
    color: '#22C55E',
  },
});