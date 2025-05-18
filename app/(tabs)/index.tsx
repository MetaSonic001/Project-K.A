import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFirebaseInventory, InventoryItem } from '@/hooks/useFirebaseInventory';
import { FoodItem } from '@/components/ui/FoodItem';
import { AppLoading } from '@/components/ui/AppLoading';
import { AiSuggestion } from '@/components/AiSuggestion';
import { getSuggestion } from '@/services/groqApi';
import { LinearGradient } from 'expo-linear-gradient';
import { Sparkles, Bell, ChefHat } from 'lucide-react-native';

export default function HomeScreen() {
  const { inventory, loading, error } = useFirebaseInventory();
  const [refreshing, setRefreshing] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [suggestionLoading, setSuggestionLoading] = useState(true);
  
  // Group inventory by category
  const inventoryByCategory = inventory.reduce((acc, item) => {
    const { category } = item;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, InventoryItem[]>);
  
  // Get low stock items
  const lowStockItems = inventory.filter(item => item.isLow);
  
  // Function to fetch AI suggestion
  const fetchAiSuggestion = async () => {
    setSuggestionLoading(true);
    try {
      const ingredients = inventory.map(item => item.name);
      const suggestion = await getSuggestion(ingredients);
      setAiSuggestion(suggestion);
    } catch (error) {
      console.error('Error fetching AI suggestion:', error);
      setAiSuggestion('Based on your ingredients, I suggest making a delicious curry today!');
    } finally {
      setSuggestionLoading(false);
    }
  };
  
  useEffect(() => {
    if (inventory.length > 0) {
      fetchAiSuggestion();
    }
  }, [inventory]);
  
  const onRefresh = async () => {
    setRefreshing(true);
    // In a real app, we would re-fetch the inventory data
    // For this demo, we'll just wait a second
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  if (loading) {
    return <AppLoading message="Loading your kitchen..." />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <LinearGradient
            colors={['#3B82F6', '#6366F1']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.headerGradient}
          >
            <View style={styles.headerTop}>
              <View>
                <Text style={styles.greeting}>Hi, Chef!</Text>
                <Text style={styles.subGreeting}>Here's what you have today.</Text>
              </View>
              <TouchableOpacity style={styles.notificationIcon}>
                <Bell color="#FFFFFF" size={24} />
                {lowStockItems.length > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{lowStockItems.length}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
            
            <View style={styles.statsContainer}>
              <View style={styles.stat}>
                <Text style={styles.statValue}>{inventory.length}</Text>
                <Text style={styles.statLabel}>Items</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.stat}>
                <Text style={styles.statValue}>{lowStockItems.length}</Text>
                <Text style={styles.statLabel}>Low Stock</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.stat}>
                <Text style={styles.statValue}>15</Text>
                <Text style={styles.statLabel}>Recipes</Text>
              </View>
            </View>
          </LinearGradient>
        </View>
        
        {lowStockItems.length > 0 && (
          <View style={styles.alertContainer}>
            <View style={styles.alertHeader}>
              <Text style={styles.alertTitle}>Low on Stock</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.alertScroll}
            >
              {lowStockItems.map(item => (
                <View key={item.id} style={styles.alertItem}>
                  <Text style={styles.alertItemText}>{item.name}</Text>
                </View>
              ))}
              <TouchableOpacity style={styles.alertButton}>
                <Text style={styles.alertButtonText}>Restock All</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        )}
        
        {aiSuggestion && (
          <AiSuggestion
            suggestion={aiSuggestion}
            onPress={() => {}}
          />
        )}
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Your Kitchen</Text>
          
          {Object.entries(inventoryByCategory).map(([category, items]) => (
            <View key={category} style={styles.categoryContainer}>
              <Text style={styles.categoryTitle}>{category}</Text>
              
              {items.map(item => (
                <FoodItem
                  key={item.id}
                  item={item}
                  onPress={() => {}}
                />
              ))}
            </View>
          ))}
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Last updated: {new Date().toLocaleTimeString()}
          </Text>
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
    paddingBottom: 100,
  },
  header: {
    marginBottom: 16,
  },
  headerGradient: {
    padding: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: '#FFFFFF',
  },
  subGreeting: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  badgeText: {
    fontFamily: 'Inter-Bold',
    fontSize: 10,
    color: '#FFFFFF',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 16,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    color: '#FFFFFF',
  },
  statLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  statDivider: {
    width: 1,
    height: '80%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  alertContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
    overflow: 'hidden',
  },
  alertHeader: {
    padding: 12,
    backgroundColor: '#FEE2E2',
  },
  alertTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#B91C1C',
  },
  alertScroll: {
    padding: 12,
    paddingRight: 24,
  },
  alertItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  alertItemText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#B91C1C',
  },
  alertButton: {
    backgroundColor: '#EF4444',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  alertButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
  },
  sectionContainer: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: '#0F172A',
    marginBottom: 16,
  },
  categoryContainer: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#64748B',
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#3B82F6',
    paddingLeft: 8,
  },
  footer: {
    alignItems: 'center',
    padding: 16,
  },
  footerText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#94A3B8',
  },
});