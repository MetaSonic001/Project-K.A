import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Image } from 'expo-image';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Recipe } from '@/services/groqApi';
import { Check, ChefHat, Clock } from 'lucide-react-native';

interface RecipeCardProps {
  recipe: Recipe;
  onPress?: (recipe: Recipe) => void;
}

export function RecipeCard({ recipe, onPress }: RecipeCardProps) {
  const handlePress = () => {
    if (onPress) {
      onPress(recipe);
    }
  };

  const availableIngredients = recipe.ingredients.filter(i => i.available).length;
  const totalIngredients = recipe.ingredients.length;
  const matchPercentage = Math.round((availableIngredients / totalIngredients) * 100);

  return (
    <Card style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handlePress}
        style={styles.touchable}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: recipe.imageUrl }}
            style={styles.image}
            contentFit="cover"
            transition={300}
          />
          <View style={styles.matchBadge}>
            <Text style={styles.matchText}>{matchPercentage}% Match</Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{recipe.name}</Text>
          
          <View style={styles.metaRow}>
            <View style={styles.meta}>
              <Clock size={16} color="#64748B" />
              <Text style={styles.metaText}>
                {recipe.preparationTime + recipe.cookingTime} min
              </Text>
            </View>
            <View style={styles.meta}>
              <ChefHat size={16} color="#64748B" />
              <Text style={styles.metaText}>
                {recipe.servings} servings
              </Text>
            </View>
          </View>

          <Text style={styles.ingredientsTitle}>Ingredients</Text>
          <View style={styles.ingredientsList}>
            {recipe.ingredients.slice(0, 3).map((ingredient, index) => (
              <View key={index} style={styles.ingredient}>
                <View style={[
                  styles.checkCircle,
                  ingredient.available ? styles.available : styles.unavailable,
                ]}>
                  {ingredient.available && <Check size={12} color="#FFFFFF" />}
                </View>
                <Text style={styles.ingredientText}>
                  {ingredient.name} ({ingredient.quantity})
                </Text>
              </View>
            ))}
            {recipe.ingredients.length > 3 && (
              <Text style={styles.moreIngredients}>
                +{recipe.ingredients.length - 3} more
              </Text>
            )}
          </View>

          <Button 
            title="View Recipe" 
            variant="primary"
            size="sm"
            gradient={true}
            style={styles.button}
          />
        </View>
      </TouchableOpacity>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 280,
    marginRight: 16,
    overflow: 'hidden',
  },
  touchable: {
    width: '100%',
  },
  imageContainer: {
    width: '100%',
    height: 160,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  matchBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  matchText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaText: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 4,
  },
  ingredientsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 8,
  },
  ingredientsList: {
    marginBottom: 16,
  },
  ingredient: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  checkCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  available: {
    backgroundColor: '#22C55E',
  },
  unavailable: {
    backgroundColor: '#E2E8F0',
  },
  ingredientText: {
    fontSize: 14,
    color: '#334155',
  },
  moreIngredients: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  button: {
    width: '100%',
  },
});