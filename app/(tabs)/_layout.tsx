import { Tabs } from 'expo-router';
import { StyleSheet, View, Pressable } from 'react-native';
import { Chrome as Home, Book, ShoppingBag, Package, User } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { Platform } from 'react-native';

function TabBarIcon({ 
  isFocused, 
  icon: Icon, 
  iconName,
}: { 
  isFocused: boolean; 
  icon: typeof Home; 
  iconName: string;
}) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Icon
        size={24}
        color={isFocused ? '#3B82F6' : '#94A3B8'}
        strokeWidth={isFocused ? 2.5 : 2}
      />
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        headerShown: false,
        tabBarShowLabel: Platform.OS === 'web',
        tabBarBackground: () => (
          Platform.OS !== 'web' ? (
            <BlurView 
              tint="light" 
              intensity={80} 
              style={StyleSheet.absoluteFill}
            />
          ) : null
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon isFocused={focused} icon={Home} iconName="home" />
          ),
        }}
      />
      <Tabs.Screen
        name="recipes"
        options={{
          title: 'Recipes',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon isFocused={focused} icon={Book} iconName="book" />
          ),
        }}
      />
      <Tabs.Screen
        name="shopping"
        options={{
          title: 'Shopping',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon isFocused={focused} icon={ShoppingBag} iconName="shopping-bag" />
          ),
        }}
      />
      <Tabs.Screen
        name="inventory"
        options={{
          title: 'Inventory',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon isFocused={focused} icon={Package} iconName="package" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon isFocused={focused} icon={User} iconName="user" />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Platform.OS === 'web' ? '#FFFFFF' : 'transparent',
    borderTopWidth: 0,
    elevation: 0,
    height: 60,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabBarLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
});