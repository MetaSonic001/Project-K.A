import { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '@/services/firebase';

export interface FoodSensorData {
  distance: number;
  weight: number;
  foodLevel: number;
  timestamp: number;
  interval: number;
}

export interface InventoryItem extends FoodSensorData {
  id: string;
  name: string;
  category: string;
  image: string;
  threshold: number;
  unit: string;
  isLow: boolean;
}

export const useFirebaseInventory = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  useEffect(() => {
    const foodMonitorRef = ref(database, '/food_monitor_1');
    
    try {
      const unsubscribe = onValue(foodMonitorRef, (snapshot) => {
        if (snapshot.exists()) {
          const sensorData = snapshot.val() as FoodSensorData;
          
          // In a real app, we would map the sensor data to inventory items
          // For demo purposes, we'll use mock inventory data with the sensor values
          const mockInventory: InventoryItem[] = [
            {
              id: '1',
              name: 'Rice',
              category: 'Grains',
              image: 'https://images.pexels.com/photos/4198050/pexels-photo-4198050.jpeg',
              threshold: 500,
              unit: 'g',
              isLow: sensorData.weight < 500,
              ...sensorData,
            },
            {
              id: '2',
              name: 'Wheat Flour',
              category: 'Grains',
              image: 'https://images.pexels.com/photos/5765/flour-food-kitchen-bakery.jpg',
              threshold: 300,
              unit: 'g',
              isLow: false,
              ...sensorData,
              weight: 1200,
              foodLevel: 80,
            },
            {
              id: '3',
              name: 'Onions',
              category: 'Vegetables',
              image: 'https://images.pexels.com/photos/4197447/pexels-photo-4197447.jpeg',
              threshold: 200,
              unit: 'g',
              isLow: true,
              ...sensorData,
              weight: 150,
              foodLevel: 15,
            },
            {
              id: '4',
              name: 'Tomatoes',
              category: 'Vegetables',
              image: 'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg',
              threshold: 300,
              unit: 'g',
              isLow: false,
              ...sensorData,
              weight: 450,
              foodLevel: 65,
            },
            {
              id: '5',
              name: 'Chicken',
              category: 'Meat',
              image: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg',
              threshold: 400,
              unit: 'g',
              isLow: false,
              ...sensorData,
              weight: 750,
              foodLevel: 75,
            },
            {
              id: '6',
              name: 'Garlic',
              category: 'Spices',
              image: 'https://images.pexels.com/photos/4197442/pexels-photo-4197442.jpeg',
              threshold: 50,
              unit: 'g',
              isLow: true,
              ...sensorData,
              weight: 30,
              foodLevel: 20,
            },
            {
              id: '7',
              name: 'Turmeric',
              category: 'Spices',
              image: 'https://images.pexels.com/photos/4198762/pexels-photo-4198762.jpeg',
              threshold: 30,
              unit: 'g',
              isLow: false,
              ...sensorData,
              weight: 45,
              foodLevel: 60,
            },
            {
              id: '8',
              name: 'Milk',
              category: 'Dairy',
              image: 'https://images.pexels.com/photos/2064359/pexels-photo-2064359.jpeg',
              threshold: 200,
              unit: 'ml',
              isLow: false,
              ...sensorData,
              weight: 450,
              foodLevel: 90,
            },
          ];
          
          setInventory(mockInventory);
          setLoading(false);
        } else {
          setError('No data available');
          setLoading(false);
        }
      }, (error) => {
        setError(error.message);
        setLoading(false);
      });
      
      return () => unsubscribe();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
      setLoading(false);
    }
  }, []);

  return { inventory, loading, error };
};