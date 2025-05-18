import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withSequence,
  withDelay
} from 'react-native-reanimated';
import { Card } from '@/components/ui/Card';
import { Sparkles } from 'lucide-react-native';

interface AiSuggestionProps {
  suggestion: string;
  imageUrl?: string;
  onPress?: () => void;
}

export function AiSuggestion({ 
  suggestion, 
  imageUrl = 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg',
  onPress 
}: AiSuggestionProps) {
  const [isNew, setIsNew] = useState(true);
  
  const scaleAnim = useSharedValue(0.95);
  const opacityAnim = useSharedValue(0);
  const sparkleOpacity = useSharedValue(0);
  
  useEffect(() => {
    // Animate in
    scaleAnim.value = withSequence(
      withSpring(1.02, { duration: 400 }),
      withSpring(1, { duration: 300 })
    );
    
    opacityAnim.value = withSpring(1, { duration: 500 });
    
    // Animate sparkles
    sparkleOpacity.value = withDelay(
      600,
      withSequence(
        withSpring(1, { duration: 400 }),
        withDelay(2000, withSpring(0, { duration: 1000 }))
      )
    );
    
    // Remove "new" badge after 5 seconds
    const timer = setTimeout(() => {
      setIsNew(false);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const containerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scaleAnim.value }],
      opacity: opacityAnim.value,
    };
  });
  
  const sparkleStyle = useAnimatedStyle(() => {
    return {
      opacity: sparkleOpacity.value,
    };
  });

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
      <Animated.View style={[containerStyle]}>
        <Card style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>AI Suggestion</Text>
            {isNew && (
              <View style={styles.newBadge}>
                <Text style={styles.newText}>NEW</Text>
              </View>
            )}
          </View>
          
          <View style={styles.content}>
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: imageUrl }}
                style={styles.image}
                contentFit="cover"
                transition={300}
              />
              <Animated.View style={[styles.sparkleContainer, sparkleStyle]}>
                <Sparkles size={20} color="#FFFFFF" />
              </Animated.View>
            </View>
            
            <View style={styles.textContainer}>
              <Text style={styles.suggestion}>{suggestion}</Text>
            </View>
          </View>
        </Card>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F172A',
  },
  newBadge: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  newText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    padding: 16,
    paddingTop: 8,
  },
  imageContainer: {
    width: '100%',
    height: 150,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  sparkleContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(99, 102, 241, 0.8)',
    borderRadius: 20,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    
  },
  suggestion: {
    fontSize: 16,
    color: '#334155',
    lineHeight: 24,
  },
});