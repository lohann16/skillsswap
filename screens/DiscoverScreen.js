import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { globalStyles } from '../styles/globalStyles';

const INITIAL_TRENDS = [
  { id: '1', title: 'Photography 101' },
  { id: '2', title: 'Emotional Intelligence' },
];

export default function DiscoverScreen({ navigation }) {
  const [trends, setTrends] = useState(INITIAL_TRENDS);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      
    } finally {
      setRefreshing(false);
    }
  }, []);

  const renderItem = useCallback(
    ({ item }) => (
      <TouchableOpacity
        style={globalStyles.card}
        activeOpacity={0.7}
        onPress={() => navigation?.navigate('SkillDetail', { id: item.id })}
      >
        <Text style={globalStyles.cardText}>{item.title}</Text>
      </TouchableOpacity>
    ),
    [navigation]
  );

  const keyExtractor = useCallback((item) => item.id, []);

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Discover New Skills</Text>
      <FlatList
        data={trends}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={globalStyles.cardText}>No trends yet — check back soon.</Text>
        }
        contentContainerStyle={trends.length === 0 && { flexGrow: 1, justifyContent: 'center' }}
      />
    </View>
  );
}