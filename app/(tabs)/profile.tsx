import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { AppLoading } from '@/components/ui/AppLoading';
import { Card } from '@/components/ui/Card';
import { User, LogOut, Bell, Moon, ChevronRight, ShieldCheck, CircleHelp as HelpCircle, Heart } from 'lucide-react-native';
import { Image } from 'expo-image';

export default function ProfileScreen() {
  const { user, loading, error, signOut } = useAuth();
  
  // Preferences state
  const [preferences, setPreferences] = useState({
    darkMode: false,
    notifications: true,
    stockAlerts: true,
    recipesSuggestions: true,
    defaultGrocery: 'zepto',
  });
  
  // Toggle preference
  const togglePreference = (key: keyof typeof preferences) => {
    if (typeof preferences[key] === 'boolean') {
      setPreferences(prev => ({
        ...prev,
        [key]: !prev[key],
      }));
    }
  };
  
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return <AppLoading message="Loading your profile..." />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Card style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.profileImageContainer}>
              <Image
                source={{ uri: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg' }}
                style={styles.profileImage}
                contentFit="cover"
              />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>
                {user?.displayName || 'Chef User'}
              </Text>
              <Text style={styles.profileEmail}>
                {user?.email || 'user@example.com'}
              </Text>
            </View>
          </View>
          <Button
            title="Edit Profile"
            variant="outline"
            size="sm"
            style={styles.editProfileButton}
          />
        </Card>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <Card style={styles.preferencesCard}>
            <View style={styles.preferenceItem}>
              <View style={styles.preferenceLeft}>
                <Moon size={20} color="#64748B" />
                <Text style={styles.preferenceText}>Dark Mode</Text>
              </View>
              <Switch
                value={preferences.darkMode}
                onValueChange={() => togglePreference('darkMode')}
                trackColor={{ false: '#E2E8F0', true: '#93C5FD' }}
                thumbColor={preferences.darkMode ? '#3B82F6' : '#FFFFFF'}
              />
            </View>
            
            <View style={styles.preferenceItem}>
              <View style={styles.preferenceLeft}>
                <Bell size={20} color="#64748B" />
                <Text style={styles.preferenceText}>Notifications</Text>
              </View>
              <Switch
                value={preferences.notifications}
                onValueChange={() => togglePreference('notifications')}
                trackColor={{ false: '#E2E8F0', true: '#93C5FD' }}
                thumbColor={preferences.notifications ? '#3B82F6' : '#FFFFFF'}
              />
            </View>
            
            <View style={styles.preferenceItem}>
              <View style={styles.preferenceLeft}>
                <Text style={styles.preferenceText}>Low Stock Alerts</Text>
              </View>
              <Switch
                value={preferences.stockAlerts}
                onValueChange={() => togglePreference('stockAlerts')}
                trackColor={{ false: '#E2E8F0', true: '#93C5FD' }}
                thumbColor={preferences.stockAlerts ? '#3B82F6' : '#FFFFFF'}
              />
            </View>
            
            <View style={styles.preferenceItem}>
              <View style={styles.preferenceLeft}>
                <Text style={styles.preferenceText}>Recipe Suggestions</Text>
              </View>
              <Switch
                value={preferences.recipesSuggestions}
                onValueChange={() => togglePreference('recipesSuggestions')}
                trackColor={{ false: '#E2E8F0', true: '#93C5FD' }}
                thumbColor={preferences.recipesSuggestions ? '#3B82F6' : '#FFFFFF'}
              />
            </View>
            
            <TouchableOpacity style={styles.preferenceItemLink}>
              <View style={styles.preferenceLeft}>
                <Text style={styles.preferenceText}>Default Grocery Service</Text>
              </View>
              <View style={styles.preferenceRight}>
                <Text style={styles.preferenceValue}>
                  {preferences.defaultGrocery === 'zepto' ? 'Zepto' : 'Blinkit'}
                </Text>
                <ChevronRight size={16} color="#64748B" />
              </View>
            </TouchableOpacity>
          </Card>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <Card style={styles.supportCard}>
            <TouchableOpacity style={styles.supportItem}>
              <View style={styles.supportIconContainer}>
                <HelpCircle size={20} color="#3B82F6" />
              </View>
              <Text style={styles.supportText}>Help & FAQ</Text>
              <ChevronRight size={16} color="#64748B" style={styles.supportArrow} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.supportItem}>
              <View style={styles.supportIconContainer}>
                <ShieldCheck size={20} color="#3B82F6" />
              </View>
              <Text style={styles.supportText}>Privacy Policy</Text>
              <ChevronRight size={16} color="#64748B" style={styles.supportArrow} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.supportItem}>
              <View style={styles.supportIconContainer}>
                <Heart size={20} color="#3B82F6" />
              </View>
              <Text style={styles.supportText}>About Smart Kitchen AI</Text>
              <ChevronRight size={16} color="#64748B" style={styles.supportArrow} />
            </TouchableOpacity>
          </Card>
        </View>
        
        <Button
          title="Sign Out"
          variant="outline"
          leftIcon={<LogOut size={18} color="#EF4444" />}
          style={styles.signOutButton}
          textStyle={styles.signOutButtonText}
          onPress={handleSignOut}
        />
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>Smart Kitchen AI v1.0.0</Text>
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
  header: {
    padding: 16,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
    color: '#0F172A',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  profileCard: {
    marginHorizontal: 16,
    marginBottom: 24,
    padding: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImageContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
    backgroundColor: '#F1F5F9',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  profileInfo: {
    marginLeft: 16,
  },
  profileName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#0F172A',
    marginBottom: 4,
  },
  profileEmail: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
  },
  editProfileButton: {
    alignSelf: 'flex-start',
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
  preferencesCard: {
    marginHorizontal: 16,
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  preferenceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  preferenceText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#0F172A',
    marginLeft: 12,
  },
  preferenceItemLink: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  preferenceRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  preferenceValue: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
    marginRight: 8,
  },
  supportCard: {
    marginHorizontal: 16,
  },
  supportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  supportIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  supportText: {
    flex: 1,
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#0F172A',
  },
  supportArrow: {
    
  },
  signOutButton: {
    marginHorizontal: 16,
    marginVertical: 24,
    borderColor: '#FEE2E2',
  },
  signOutButtonText: {
    color: '#EF4444',
  },
  footer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  footerText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#94A3B8',
  },
});