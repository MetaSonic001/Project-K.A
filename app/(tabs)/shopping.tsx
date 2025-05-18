import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFirebaseInventory, InventoryItem } from '@/hooks/useFirebaseInventory';
import { ShoppingItem } from '@/components/ShoppingItem';
import { AppLoading } from '@/components/ui/AppLoading';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ShoppingBag, Truck, ArrowRight } from 'lucide-react-native';
import { Image } from 'expo-image';

interface CartItem {
  item: InventoryItem;
  quantity: number;
}

export default function ShoppingScreen() {
  const { inventory, loading } = useFirebaseInventory();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  
  // Get low stock items
  const lowStockItems = inventory.filter(item => item.isLow);
  
  useEffect(() => {
    // Initialize quantities
    const initialQuantities: Record<string, number> = {};
    lowStockItems.forEach(item => {
      initialQuantities[item.id] = 1;
    });
    setQuantities(initialQuantities);
  }, [lowStockItems]);
  
  const incrementQuantity = (itemId: string) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 1) + 1,
    }));
  };
  
  const decrementQuantity = (itemId: string) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: Math.max(1, (prev[itemId] || 1) - 1),
    }));
  };
  
  const addToCart = (item: InventoryItem) => {
    const existingItem = cart.find(cartItem => cartItem.item.id === item.id);
    
    if (existingItem) {
      setCart(cart.map(cartItem => 
        cartItem.item.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + (quantities[item.id] || 1) }
          : cartItem
      ));
    } else {
      setCart([...cart, { item, quantity: quantities[item.id] || 1 }]);
    }
  };
  
  const removeFromCart = (itemId: string) => {
    setCart(cart.filter(cartItem => cartItem.item.id !== itemId));
  };
  
  const calculateTotal = () => {
    // In a real app, this would calculate based on actual prices
    return cart.reduce((total, cartItem) => total + cartItem.quantity * 10, 0).toFixed(2);
  };
  
  const openDeliveryApp = (app: 'zepto' | 'blinkit') => {
    const urls = {
      zepto: 'https://www.zeptonow.com/',
      blinkit: 'https://blinkit.com/',
    };
    
    Linking.openURL(urls[app]).catch(() => {
      // Handle error
      console.error(`Couldn't open ${app} app`);
    });
  };

  if (loading) {
    return <AppLoading message="Loading your shopping list..." />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Shopping</Text>
        <View style={styles.cartBadge}>
          <ShoppingBag size={18} color="#FFFFFF" />
          <Text style={styles.cartBadgeText}>{cart.length}</Text>
        </View>
      </View>
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {lowStockItems.length === 0 && cart.length === 0 ? (
          <View style={styles.emptyContainer}>
            <ShoppingBag size={64} color="#CBD5E1" />
            <Text style={styles.emptyTitle}>Your pantry is well stocked</Text>
            <Text style={styles.emptyText}>
              All your ingredients are at sufficient levels. Check back later!
            </Text>
          </View>
        ) : (
          <>
            {lowStockItems.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Low Stock Items</Text>
                
                {lowStockItems.map(item => (
                  <ShoppingItem
                    key={item.id}
                    item={item}
                    quantity={quantities[item.id] || 1}
                    onIncrement={() => incrementQuantity(item.id)}
                    onDecrement={() => decrementQuantity(item.id)}
                    onAddToCart={() => addToCart(item)}
                  />
                ))}
              </View>
            )}
            
            {cart.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Your Cart</Text>
                
                <Card style={styles.cartContainer}>
                  {cart.map(({ item, quantity }) => (
                    <View key={item.id} style={styles.cartItem}>
                      <View style={styles.cartItemInfo}>
                        <View style={styles.cartItemImageContainer}>
                          <Image
                            source={{ uri: item.image }}
                            style={styles.cartItemImage}
                            contentFit="cover"
                          />
                        </View>
                        <View style={styles.cartItemDetails}>
                          <Text style={styles.cartItemName}>{item.name}</Text>
                          <Text style={styles.cartItemQuantity}>
                            Qty: {quantity}
                          </Text>
                        </View>
                      </View>
                      <TouchableOpacity 
                        style={styles.removeButton}
                        onPress={() => removeFromCart(item.id)}
                      >
                        <Text style={styles.removeButtonText}>Remove</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                  
                  <View style={styles.cartTotal}>
                    <Text style={styles.cartTotalLabel}>Estimated Total</Text>
                    <Text style={styles.cartTotalValue}>₹{calculateTotal()}</Text>
                  </View>
                  
                  <Text style={styles.deliveryLabel}>Choose Delivery Partner</Text>
                  <View style={styles.deliveryOptions}>
                    <TouchableOpacity 
                      style={styles.deliveryOption}
                      onPress={() => openDeliveryApp('zepto')}
                    >
                      <View style={styles.deliveryOptionContent}>
                        <Text style={styles.deliveryOptionName}>Zepto</Text>
                        <Text style={styles.deliveryOptionMeta}>
                          10-15 min delivery
                        </Text>
                      </View>
                      <ArrowRight size={16} color="#64748B" />
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={styles.deliveryOption}
                      onPress={() => openDeliveryApp('blinkit')}
                    >
                      <View style={styles.deliveryOptionContent}>
                        <Text style={styles.deliveryOptionName}>Blinkit</Text>
                        <Text style={styles.deliveryOptionMeta}>
                          10 min delivery
                        </Text>
                      </View>
                      <ArrowRight size={16} color="#64748B" />
                    </TouchableOpacity>
                  </View>
                </Card>
              </View>
            )}
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Suggested Packs</Text>
              
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.packsList}
              >
                <TouchableOpacity style={styles.packCard}>
                  <View style={styles.packImageContainer}>
                    <Image
                      source={{ uri: 'https://images.pexels.com/photos/4198035/pexels-photo-4198035.jpeg' }}
                      style={styles.packImage}
                      contentFit="cover"
                    />
                  </View>
                  <View style={styles.packContent}>
                    <Text style={styles.packTitle}>Spice Starter Kit</Text>
                    <Text style={styles.packDescription}>
                      10 essential Indian spices for any kitchen
                    </Text>
                    <Text style={styles.packPrice}>₹350</Text>
                  </View>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.packCard}>
                  <View style={styles.packImageContainer}>
                    <Image
                      source={{ uri: 'https://images.pexels.com/photos/977260/pexels-photo-977260.jpeg' }}
                      style={styles.packImage}
                      contentFit="cover"
                    />
                  </View>
                  <View style={styles.packContent}>
                    <Text style={styles.packTitle}>Veggie Week Pack</Text>
                    <Text style={styles.packDescription}>
                      7 days worth of fresh vegetables
                    </Text>
                    <Text style={styles.packPrice}>₹550</Text>
                  </View>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.packCard}>
                  <View style={styles.packImageContainer}>
                    <Image
                      source={{ uri: 'https://images.pexels.com/photos/2733918/pexels-photo-2733918.jpeg' }}
                      style={styles.packImage}
                      contentFit="cover"
                    />
                  </View>
                  <View style={styles.packContent}>
                    <Text style={styles.packTitle}>Breakfast Bundle</Text>
                    <Text style={styles.packDescription}>
                      Essentials for quick morning meals
                    </Text>
                    <Text style={styles.packPrice}>₹450</Text>
                  </View>
                </TouchableOpacity>
              </ScrollView>
            </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
    color: '#0F172A',
  },
  cartBadge: {
    backgroundColor: '#3B82F6',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cartBadgeText: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    textAlign: 'center',
    fontFamily: 'Inter-Bold',
    fontSize: 12,
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
    marginBottom: 16,
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
  },
  cartContainer: {
    marginHorizontal: 16,
    padding: 16,
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  cartItemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartItemImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#F1F5F9',
  },
  cartItemImage: {
    width: '100%',
    height: '100%',
  },
  cartItemDetails: {
    marginLeft: 12,
  },
  cartItemName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#0F172A',
  },
  cartItemQuantity: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
  },
  removeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FEE2E2',
    borderRadius: 6,
  },
  removeButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#EF4444',
  },
  cartTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  cartTotalLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#0F172A',
  },
  cartTotalValue: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: '#0F172A',
  },
  deliveryLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#0F172A',
    marginTop: 16,
    marginBottom: 12,
  },
  deliveryOptions: {
    
  },
  deliveryOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  deliveryOptionContent: {
    
  },
  deliveryOptionName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#0F172A',
  },
  deliveryOptionMeta: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
  },
  packsList: {
    paddingHorizontal: 16,
  },
  packCard: {
    width: 220,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  packImageContainer: {
    width: '100%',
    height: 120,
  },
  packImage: {
    width: '100%',
    height: '100%',
  },
  packContent: {
    padding: 12,
  },
  packTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#0F172A',
    marginBottom: 4,
  },
  packDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
  },
  packPrice: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#3B82F6',
  },
});