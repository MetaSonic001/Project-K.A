import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useFirebaseInventory } from '@/hooks/useFirebaseInventory';
import { Recipe, generateRecipes } from '@/services/groqApi';
import { RecipeCard } from '@/components/RecipeCard';
import { Button } from '@/components/ui/Button';
import { AppLoading } from '@/components/ui/AppLoading';
import { Search, Filter, ChefHat } from 'lucide-react-native';

type MoodFilter = 'All' | 'Quick' | 'Easy' | 'Vegetarian' | 'Spicy';

export default function RecipesScreen() {
  const { inventory, loading } = useFirebaseInventory();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMood, setSelectedMood] = useState<MoodFilter>('All');
  const [recipesLoading, setRecipesLoading] = useState(true);

  const moods: MoodFilter[] = ['All', 'Quick', 'Easy', 'Vegetarian', 'Spicy'];

  useEffect(() => {
    if (inventory.length > 0) {
      loadRecipes();
    }
  }, [inventory]);

  const loadRecipes = async () => {
    setRecipesLoading(true);
    try {
      const ingredients = inventory.map(item => item.name);
      const recipeData = await generateRecipes({ ingredients });
      setRecipes(recipeData);
    } catch (error) {
      console.error('Error loading recipes:', error);
    } finally {
      setRecipesLoading(false);
    }
  };

  const filteredRecipes = recipes.filter(recipe => {
    // Filter by search query
    const matchesSearch = searchQuery === '' || 
      recipe.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by mood
    const matchesMood = selectedMood === 'All' ||
      (selectedMood === 'Quick' && recipe.preparationTime + recipe.cookingTime <= 30) ||
      (selectedMood === 'Easy' && recipe.steps.length <= 5) ||
      (selectedMood === 'Vegetarian' && !recipe.ingredients.some(i => 
        i.name.toLowerCase().includes('chicken') ||
        i.name.toLowerCase().includes('beef') ||
        i.name.toLowerCase().includes('pork') ||
        i.name.toLowerCase().includes('fish')
      )) ||
      (selectedMood === 'Spicy');
    
    return matchesSearch && matchesMood;
  });

  // Group recipes by match score
  const greatMatches = filteredRecipes.filter(r => r.matchScore >= 80);
  const goodMatches = filteredRecipes.filter(r => r.matchScore >= 50 && r.matchScore < 80);
  const otherRecipes = filteredRecipes.filter(r => r.matchScore < 50);

  const handleRecipePress = (recipe: Recipe) => {
    router.push(`/recipe/${recipe.id}`);
  };

  if (loading || recipesLoading) {
    return <AppLoading message="Finding delicious recipes..." />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Recipes</Text>
        <View style={styles.searchContainer}>
          <Search size={20} color="#64748B" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search recipes..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={20} color="#64748B" />
          </TouchableOpacity>
        </View>
        
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.moodFilters}
        >
          {moods.map((mood) => (
            <TouchableOpacity
              key={mood}
              style={[
                styles.moodButton,
                selectedMood === mood && styles.selectedMoodButton,
              ]}
              onPress={() => setSelectedMood(mood)}
            >
              <Text
                style={[
                  styles.moodButtonText,
                  selectedMood === mood && styles.selectedMoodButtonText,
                ]}
              >
                {mood}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filteredRecipes.length === 0 ? (
          <View style={styles.emptyContainer}>
            <ChefHat size={64} color="#CBD5E1" />
            <Text style={styles.emptyTitle}>No recipes found</Text>
            <Text style={styles.emptyText}>
              Try changing your search or filters to find more recipes.
            </Text>
            <Button 
              title="Reset Filters" 
              onPress={() => {
                setSearchQuery('');
                setSelectedMood('All');
              }}
              style={styles.resetButton}
            />
          </View>
        ) : (
          <>
            {greatMatches.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Perfect Match</Text>
                <Text style={styles.sectionDescription}>
                  Recipes you can make with what you have
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.recipesList}
                >
                  {greatMatches.map(recipe => (
                    <RecipeCard
                      key={recipe.id}
                      recipe={recipe}
                      onPress={handleRecipePress}
                    />
                  ))}
                </ScrollView>
              </View>
            )}

            {goodMatches.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Good Match</Text>
                <Text style={styles.sectionDescription}>
                  Missing just a few ingredients
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.recipesList}
                >
                  {goodMatches.map(recipe => (
                    <RecipeCard
                      key={recipe.id}
                      recipe={recipe}
                      onPress={handleRecipePress}
                    />
                  ))}
                </ScrollView>
              </View>
            )}

            {otherRecipes.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>More Recipes</Text>
                <Text style={styles.sectionDescription}>
                  You'll need to shop for these
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.recipesList}
                >
                  {otherRecipes.map(recipe => (
                    <RecipeCard
                      key={recipe.id}
                      recipe={recipe}
                      onPress={handleRecipePress}
                    />
                  ))}
                </ScrollView>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    padding: 16,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
    color: '#0F172A',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginHorizontal: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#0F172A',
    padding: 8,
  },
  filterButton: {
    padding: 8,
  },
  moodFilters: {
    paddingVertical: 8,
  },
  moodButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  selectedMoodButton: {
    backgroundColor: '#3B82F6',
  },
  moodButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#64748B',
  },
  selectedMoodButtonText: {
    color: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: '#0F172A',
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  sectionDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  recipesList: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    marginTop: 64,
  },
  emptyTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: '#0F172A',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 24,
  },
  resetButton: {
    width: 200,
  },
});