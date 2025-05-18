import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { ShoppingCart as ShoppingCartIcon, Plus as PlusIcon, Minus as MinusIcon } from 'lucide-react-native';
import { InventoryItem } from '@/hooks/useFirebaseInventory';

interface ShoppingItemProps {
  item: InventoryItem;
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onAddToCart: () => void;
}

export function ShoppingItem({
  item,
  quantity,
  onIncrement,
  onDecrement,
  onAddToCart,
}: ShoppingItemProps) {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.image }}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.category}>{item.category}</Text>
        <Text style={styles.status}>
          {item.isLow ? 'Low Stock' : 'In Stock'}: {item.weight}{item.unit}
        </Text>
      </View>

      <View style={styles.actions}>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={onDecrement}
            disabled={quantity <= 1}
          >
            <MinusIcon
              size={16}
              color={quantity <= 1 ? '#CBD5E1' : '#64748B'}
            />
          </TouchableOpacity>
          <Text style={styles.quantity}>{quantity}</Text>
          <TouchableOpacity 
            style={styles.quantityButton} 
            onPress={onIncrement}
          >
            <PlusIcon size={16} color="#64748B" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.cartButton} onPress={onAddToCart}>
          <ShoppingCartIcon size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#F1F5F9',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    marginLeft: 16,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 2,
  },
  category: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 4,
  },
  status: {
    fontSize: 14,
    color: '#64748B',
  },
  actions: {
    alignItems: 'center',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    padding: 4,
    marginBottom: 8,
  },
  quantityButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  quantity: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
    marginHorizontal: 8,
    minWidth: 20,
    textAlign: 'center',
  },
  cartButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
});