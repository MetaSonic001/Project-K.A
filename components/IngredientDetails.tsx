import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { InventoryItem } from '@/hooks/useFirebaseInventory';
import { LineChart } from '@/components/charts/LineChart';
import { Clock, TrendingUp, TriangleAlert as AlertTriangle, CreditCard as Edit2 } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface IngredientDetailsProps {
  item: InventoryItem;
  onClose: () => void;
  onEdit: () => void;
}

export function IngredientDetails({ item, onClose, onEdit }: IngredientDetailsProps) {
  // Mock data for the usage chart
  const usageData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [300, 280, 250, 200, 180, 150, item.weight],
      },
    ],
  };

  // Calculate days until empty based on usage rate
  const daysUntilEmpty = Math.round((item.weight / ((300 - item.weight) / 7)));

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,1)']}
        style={styles.gradient}
      >
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: item.image }}
                style={styles.image}
                contentFit="cover"
              />
            </View>
            <View style={styles.headerContent}>
              <Text style={styles.title}>{item.name}</Text>
              <Text style={styles.category}>{item.category}</Text>
              <View style={styles.stockIndicator}>
                <View style={[
                  styles.stockDot,
                  item.isLow ? styles.stockLow : styles.stockOk
                ]} />
                <Text style={[
                  styles.stockText,
                  item.isLow ? styles.textRed : styles.textGreen
                ]}>
                  {item.isLow ? 'Low Stock' : 'In Stock'}
                </Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={onEdit}
            >
              <Edit2 size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <View style={styles.statsGrid}>
            <Card style={styles.statCard}>
              <View style={styles.statContent}>
                <Text style={styles.statValue}>{item.weight}{item.unit}</Text>
                <Text style={styles.statLabel}>Current Amount</Text>
              </View>
            </Card>
            
            <Card style={styles.statCard}>
              <View style={styles.statContent}>
                <Text style={styles.statValue}>{item.foodLevel}%</Text>
                <Text style={styles.statLabel}>Container Level</Text>
              </View>
            </Card>
            
            <Card style={styles.statCard}>
              <View style={styles.statContent}>
                <Text style={styles.statValue}>{item.threshold}{item.unit}</Text>
                <Text style={styles.statLabel}>Alert Threshold</Text>
              </View>
            </Card>
            
            <Card style={styles.statCard}>
              <View style={styles.statContent}>
                <Text style={styles.statValue}>{Math.round(item.interval / 1000)}s</Text>
                <Text style={styles.statLabel}>Update Interval</Text>
              </View>
            </Card>
          </View>

          <Card style={styles.predictionCard}>
            <View style={styles.predictionHeader}>
              <Clock size={20} color="#64748B" />
              <Text style={styles.predictionTitle}>Usage Prediction</Text>
            </View>
            <Text style={styles.predictionText}>
              At the current rate, this item will run out in{' '}
              <Text style={styles.highlightText}>{daysUntilEmpty} days</Text>
            </Text>
            {daysUntilEmpty <= 7 && (
              <View style={styles.warningContainer}>
                <AlertTriangle size={16} color="#EF4444" />
                <Text style={styles.warningText}>
                  Consider restocking soon
                </Text>
              </View>
            )}
          </Card>

          <Card style={styles.usageCard}>
            <View style={styles.usageHeader}>
              <TrendingUp size={20} color="#64748B" />
              <Text style={styles.usageTitle}>Weekly Usage</Text>
            </View>
            <LineChart data={usageData} />
          </Card>

          <View style={styles.actions}>
            <Button
              title="Update Stock Manually"
              variant="outline"
              style={styles.actionButton}
            />
            <Button
              title="Reorder Now"
              gradient={true}
              style={styles.actionButton}
            />
          </View>
        </ScrollView>

        <TouchableOpacity 
          style={styles.closeButton}
          onPress={onClose}
        >
          <Text style={styles.closeText}>Close</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.3)',
  },
  gradient: {
    flex: 1,
    marginTop: 100,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#F1F5F9',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  headerContent: {
    flex: 1,
    marginLeft: 16,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: '#0F172A',
    marginBottom: 4,
  },
  category: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#64748B',
    marginBottom: 8,
  },
  stockIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stockDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  stockLow: {
    backgroundColor: '#EF4444',
  },
  stockOk: {
    backgroundColor: '#22C55E',
  },
  stockText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  textRed: {
    color: '#EF4444',
  },
  textGreen: {
    color: '#22C55E',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
    marginBottom: 24,
  },
  statCard: {
    width: '50%',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  statContent: {
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: '#0F172A',
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
  },
  predictionCard: {
    padding: 16,
    marginBottom: 24,
  },
  predictionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  predictionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#0F172A',
    marginLeft: 8,
  },
  predictionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#334155',
    lineHeight: 24,
  },
  highlightText: {
    fontFamily: 'Inter-Bold',
    color: '#0F172A',
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  warningText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#B91C1C',
    marginLeft: 8,
  },
  usageCard: {
    padding: 16,
    marginBottom: 24,
  },
  usageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  usageTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#0F172A',
    marginLeft: 8,
  },
  actions: {
    flexDirection: 'row',
    marginBottom: 32,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  closeButton: {
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  closeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#64748B',
  },
});