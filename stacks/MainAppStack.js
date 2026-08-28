
// navigation/MainAppStack.js

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

// Main screens
import DashboardScreen from '../screens/DashboardScreen';
import MatchesScreen from '../screens/MatchesScreen';
import CourseScreen from '../screens/CourseScreen';
import ChatScreen from '../screens/ChatScreen';
import ProfileScreen from '../screens/ProfileScreen';

// Additional screens
import TestimonialsScreen from '../screens/TestimonialScreen';
import LearningHistoryScreen from '../screens/LearningHistoryScreen';
import DiscoverScreen from '../screens/DiscoverScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import CommunityRulesScreen from '../screens/CommunityRulesScreen';
import ContactsScreen from '../screens/ContactsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// =====================================================
// TAB ICON
// =====================================================

const TabIcon = ({ name, focused, color, size }) => {
  return (
    <View
      style={[
        styles.iconContainer,
        focused && styles.activeIconContainer,
      ]}
    >
      <Ionicons
        name={focused ? name : `${name}-outline`}
        size={focused ? size + 1 : size}
        color={color}
      />
    </View>
  );
};

// =====================================================
// TAB NAVIGATOR
// =====================================================

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarHideOnKeyboard: true,

        tabBarActiveTintColor: '#4F46E5',
        tabBarInactiveTintColor: '#94A3B8',

        tabBarStyle: styles.tabBar,

        tabBarLabelStyle: styles.tabBarLabel,

        tabBarItemStyle: styles.tabBarItem,

        tabBarIcon: ({ color, size, focused }) => {
          let iconName;

          switch (route.name) {
            case 'Dashboard':
              iconName = 'home';
              break;

            case 'Matches':
              iconName = 'people';
              break;

            case 'Course':
              iconName = 'book';
              break;

            case 'Chat':
              iconName = 'chatbubble-ellipses';
              break;

            case 'Profile':
              iconName = 'person-circle';
              break;

            default:
              iconName = 'ellipse';
          }

          return (
            <TabIcon
              name={iconName}
              focused={focused}
              color={color}
              size={size}
            />
          );
        },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Home',
        }}
      />

      <Tab.Screen
        name="Matches"
        component={MatchesScreen}
        options={{
          tabBarLabel: 'Matches',
        }}
      />

      <Tab.Screen
        name="Course"
        component={CourseScreen}
        options={{
          tabBarLabel: 'Learn',
        }}
      />

      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          tabBarLabel: 'Chat',
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
}

// =====================================================
// MAIN APP STACK
// =====================================================

export default function MainAppStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: {
          backgroundColor: '#F5F7FF',
        },
      }}
    >
      <Stack.Screen
        name="Main"
        component={TabNavigator}
      />

      <Stack.Screen
        name="Testimonials"
        component={TestimonialsScreen}
      />

      <Stack.Screen
        name="LearningHistory"
        component={LearningHistoryScreen}
      />

      <Stack.Screen
        name="Discover"
        component={DiscoverScreen}
      />

      <Stack.Screen
        name="Notifications"
        component={NotificationsScreen}
      />

      <Stack.Screen
        name="CommunityRules"
        component={CommunityRulesScreen}
      />

      <Stack.Screen
        name="Contact"
        component={ContactsScreen}
      />
    </Stack.Navigator>
  );
}

// =====================================================
// STYLES
// =====================================================

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',

    left: 14,
    right: 14,
    bottom: 14,

    height: 68,

    backgroundColor: '#FFFFFF',

    borderRadius: 22,

    borderTopWidth: 0,

    paddingTop: 7,
    paddingBottom: 7,

    shadowColor: '#312E81',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.12,
    shadowRadius: 14,

    elevation: 8,
  },

  tabBarItem: {
    paddingVertical: 2,
  },

  tabBarLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },

  iconContainer: {
    width: 42,
    height: 30,

    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: 12,
  },

  activeIconContainer: {
    backgroundColor: '#EEF2FF',
  },
});

