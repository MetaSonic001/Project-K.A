import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFirebaseInventory, InventoryItem } from '@/hooks/useFirebaseInventory';
import { FoodItem } from '@/components/ui/FoodItem';
import { Button } from '@/components/ui/Button';
import { AppLoading } from '@/components/ui/AppLoading';
import { Card } from '@/components/ui/Card';
import { Search, Plus, X, Package, ChartBar as BarChart2 } from 'lucide-react-native';

export default function InventoryScreen() {
  const { inventory, loading } = useFirebaseInventory();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [thresholdItem, setThresholdItem] = useState<InventoryItem | null>(null);
  const [customThreshold, setCustomThreshold] = useState('');
  
  // Extract unique categories
  const categories = Array.from(new Set(inventory.map(item => item.category)));
  
  // Filter inventory based on search and category
  const filteredInventory = inventory.filter(item => {
    const matchesSearch = searchQuery === '' || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === null || 
      item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(selectedCategory === category ? null : category);
  };
  
  const handleThresholdSave = () => {
    const threshold = parseInt(customThreshold);
    if (thresholdItem && !isNaN(threshold) && threshold >= 0) {
      // In a real app, this would update the threshold in the database
      console.log(`Setting threshold for ${thresholdItem.name} to ${threshold}${thresholdItem.unit}`);
      setThresholdItem(null);
      setCustomThreshold('');
    }
  };

  if (loading) {
    return <AppLoading message="Loading your inventory..." />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Inventory</Text>
        <View style={styles.searchContainer}>
          <Search size={20} color="#64748B" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search items..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== '' && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => setSearchQuery('')}
            >
              <X size={16} color="#64748B" />
            </TouchableOpacity>
          )}
        </View>
        
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {categories.map(category => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.categoryButtonSelected,
              ]}
              onPress={() => handleCategorySelect(category)}
            >
              <Text
                style={[
                  styles.categoryButtonText,
                  selectedCategory === category && styles.categoryButtonTextSelected,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filteredInventory.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Package size={64} color="#CBD5E1" />
            <Text style={styles.emptyTitle}>No items found</Text>
            <Text style={styles.emptyText}>
              Try changing your search or category filter.
            </Text>
            <Button 
              title="Reset Filters" 
              onPress={() => {
                setSearchQuery('');
                setSelectedCategory(null);
              }}
              style={styles.resetButton}
            />
          </View>
        ) : (
          <View style={styles.inventoryList}>
            {filteredInventory.map(item => (
              <FoodItem
                key={item.id}
                item={item}
                onPress={() => setThresholdItem(item)}
              />
            ))}
          </View>
        )}
        
        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>Inventory Stats</Text>
          
          <Card style={styles.statsCard}>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{inventory.length}</Text>
                <Text style={styles.statLabel}>Total Items</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {inventory.filter(item => item.isLow).length}
                </Text>
                <Text style={styles.statLabel}>Low Stock</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {inventory.filter(item => !item.isLow).length}
                </Text>
                <Text style={styles.statLabel}>In Stock</Text>
              </View>
            </View>
            
            <TouchableOpacity style={styles.viewDetailsButton}>
              <Text style={styles.viewDetailsText}>View Detailed Analysis</Text>
              <BarChart2 size={16} color="#3B82F6" />
            </TouchableOpacity>
          </Card>
        </View>
        
        <View style={styles.actionsContainer}>
          <Button
            title="Add New Item"
            leftIcon={<Plus size={18} color="#FFFFFF" />}
            style={styles.addButton}
          />
        </View>
      </ScrollView>
      
      {thresholdItem && (
        <View style={styles.thresholdModal}>
          <View style={styles.thresholdModalContent}>
            <Text style={styles.thresholdModalTitle}>Set Alert Threshold</Text>
            <Text style={styles.thresholdModalSubtitle}>
              When should we alert you that {thresholdItem.name} is running low?
            </Text>
            
            <View style={styles.thresholdInputContainer}>
              <TextInput
                style={styles.thresholdInput}
                placeholder="Enter threshold value"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                value={customThreshold}
                onChangeText={setCustomThreshold}
              />
              <Text style={styles.thresholdUnit}>{thresholdItem.unit}</Text>
            </View>
            
            <Text style={styles.thresholdNote}>
              Current threshold: {thresholdItem.threshold}{thresholdItem.unit}
            </Text>
            
            <View style={styles.thresholdActions}>
              <Button
                title="Cancel"
                variant="outline"
                onPress={() => {
                  setThresholdItem(null);
                  setCustomThreshold('');
                }}
                style={styles.thresholdButton}
              />
              <Button
                title="Save"
                onPress={handleThresholdSave}
                style={styles.thresholdButton}
              />
            </View>
          </View>
        </View>
      )}
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
  clearButton: {
    padding: 8,
  },
  categoriesContainer: {
    paddingVertical: 8,
  },
  categoryButton: {
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
  categoryButtonSelected: {
    backgroundColor: '#3B82F6',
  },
  categoryButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#64748B',
  },
  categoryButtonTextSelected: {
    color: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 100,
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
  inventoryList: {
    paddingHorizontal: 16,
  },
  statsContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 24,
  },
  statsTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: '#0F172A',
    marginBottom: 16,
  },
  statsCard: {
    padding: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: '#0F172A',
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  viewDetailsText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#3B82F6',
    marginRight: 8,
  },
  actionsContainer: {
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  addButton: {
    width: '100%',
  },
  thresholdModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  thresholdModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  thresholdModalTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: '#0F172A',
    marginBottom: 8,
  },
  thresholdModalSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#64748B',
    marginBottom: 24,
  },
  thresholdInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  thresholdInput: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    padding: 12,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#0F172A',
  },
  thresholdUnit: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#64748B',
    marginLeft: 8,
    width: 40,
    textAlign: 'center',
  },
  thresholdNote: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
    marginBottom: 24,
  },
  thresholdActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  thresholdButton: {
    width: 100,
    marginLeft: 8,
  },
});