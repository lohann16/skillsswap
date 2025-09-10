import React from 'react';
import { View, Text } from 'react-native';
import { globalStyles } from '../styles/globalStyles';

export default function NotificationsScreen() {
  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Notifications</Text>
      <Text style={globalStyles.text}>🔔 You have a new match!</Text>
      <Text style={globalStyles.text}>📅 Reminder: Session at 4:30 PM</Text>
    </View>
  );
}