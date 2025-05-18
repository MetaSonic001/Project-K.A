import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Recipe, generateRecipes } from '@/services/groqApi';
import { useFirebaseInventory } from '@/hooks/useFirebaseInventory';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { AppLoading } from '@/components/ui/AppLoading';
import { 
  ArrowLeft, 
  Clock, 
  ChefHat, 
  Users, 
  Check,
  ShoppingBag
} from 'lucide-react-native';

export default function RecipeDetail() {
  const { id } = useLocalSearchParams();
  const { inventory } = useFirebaseInventory();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadRecipe = async () => {
      try {
        setLoading(true);
        // In a real app, we would fetch the specific recipe
        // For this demo, we'll just fetch all recipes and find the matching one
        const ingredients = inventory.map(item => item.name);
        const recipes = await generateRecipes({ ingredients });
        const foundRecipe = recipes.find(r => r.id === id);
        
        if (foundRecipe) {
          setRecipe(foundRecipe);
        }
      } catch (error) {
        console.error('Error loading recipe:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadRecipe();
  }, [id, inventory]);
  
  const handleBack = () => {
    router.back();
  };
  
  if (loading) {
    return <AppLoading message="Loading recipe..." />;
  }
  
  if (!recipe) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Stack.Screen options={{ 
          title: 'Recipe Not Found',
          headerLeft: () => (
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <ArrowLeft size={24} color="#0F172A" />
            </TouchableOpacity>
          ),
        }} />
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundText}>Recipe not found.</Text>
          <Button 
            title="Go Back" 
            onPress={handleBack} 
            style={styles.goBackButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen options={{ 
        headerShown: false,
      }} />
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: recipe.imageUrl }}
            style={styles.image}
            contentFit="cover"
          />
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBack}
          >
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.recipeMetaContainer}>
            <View style={styles.matchContainer}>
              <Text style={styles.matchScore}>{recipe.matchScore}% Match</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{recipe.name}</Text>
          
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Clock size={20} color="#64748B" />
              <Text style={styles.metaText}>
                {recipe.preparationTime + recipe.cookingTime} min
              </Text>
            </View>
            <View style={styles.metaItem}>
              <ChefHat size={20} color="#64748B" />
              <Text style={styles.metaText}>
                {recipe.preparationTime} min prep
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Users size={20} color="#64748B" />
              <Text style={styles.metaText}>
                Serves {recipe.servings}
              </Text>
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            <Card style={styles.ingredientsCard}>
              {recipe.ingredients.map((ingredient, index) => (
                <View 
                  key={index} 
                  style={[
                    styles.ingredientItem,
                    index < recipe.ingredients.length - 1 && styles.ingredientItemBorder,
                  ]}
                >
                  <View style={[
                    styles.checkCircle,
                    ingredient.available ? styles.available : styles.unavailable,
                  ]}>
                    {ingredient.available && <Check size={16} color="#FFFFFF" />}
                  </View>
                  <View style={styles.ingredientContent}>
                    <Text style={styles.ingredientName}>{ingredient.name}</Text>
                    <Text style={styles.ingredientQuantity}>{ingredient.quantity}</Text>
                  </View>
                  
                  {!ingredient.available && (
                    <TouchableOpacity style={styles.buyButton}>
                      <ShoppingBag size={16} color="#3B82F6" />
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </Card>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Instructions</Text>
            <Card style={styles.instructionsCard}>
              {recipe.steps.map((step, index) => (
                <View 
                  key={index}
                  style={[
                    styles.instructionItem,
                    index < recipe.steps.length - 1 && styles.instructionItemBorder,
                  ]}
                >
                  <View style={styles.instructionNumber}>
                    <Text style={styles.instructionNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.instructionText}>{step}</Text>
                </View>
              ))}
            </Card>
          </View>
          
          <View style={styles.actionsContainer}>
            <Button 
              title="Start Cooking" 
              gradient={true}
              style={styles.cookButton}
            />
            
            <Button 
              title="Add Missing Ingredients to Cart" 
              variant="outline"
              leftIcon={<ShoppingBag size={18} color="#3B82F6" />}
              style={styles.cartButton}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingBottom: 32,
  },
  imageContainer: {
    width: '100%',
    height: 300,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recipeMetaContainer: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    flexDirection: 'row',
  },
  matchContainer: {
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  matchScore: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: '#FFFFFF',
  },
  contentContainer: {
    padding: 24,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
    color: '#0F172A',
    marginBottom: 16,
  },
  metaRow: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#64748B',
    marginLeft: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: '#0F172A',
    marginBottom: 16,
  },
  ingredientsCard: {
    padding: 0,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  ingredientItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  available: {
    backgroundColor: '#22C55E',
  },
  unavailable: {
    backgroundColor: '#E2E8F0',
  },
  ingredientContent: {
    flex: 1,
  },
  ingredientName: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#0F172A',
  },
  ingredientQuantity: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
  },
  buyButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  instructionsCard: {
    padding: 0,
  },
  instructionItem: {
    flexDirection: 'row',
    padding: 16,
  },
  instructionItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  instructionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    marginTop: 2,
  },
  instructionNumberText: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: '#3B82F6',
  },
  instructionText: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#334155',
    lineHeight: 24,
  },
  actionsContainer: {
    marginTop: 8,
  },
  cookButton: {
    marginBottom: 12,
  },
  cartButton: {
    
  },
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  notFoundText: {
    fontFamily: 'Inter-Medium',
    fontSize: 18,
    color: '#64748B',
    marginBottom: 16,
  },
  goBackButton: {
    width: 120,
  },
});