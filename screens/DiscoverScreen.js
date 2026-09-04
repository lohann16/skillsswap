import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { globalStyles } from '../styles/globalStyles';

const INITIAL_TRENDS = [
  {
    id: '1',
    title: 'Photography 101',
    category: 'Creative',
    description: 'Master composition, lighting, and editing basics.',
    learners: '2.3k',
    trending: true,
  },
  {
    id: '2',
    title: 'Emotional Intelligence',
    category: 'Personal Growth',
    description: 'Build self-awareness and stronger relationships.',
    learners: '1.8k',
    trending: true,
  },
  {
    id: '3',
    title: 'Public Speaking',
    category: 'Communication',
    description: 'Speak with confidence in any room.',
    learners: '1.4k',
    trending: false,
  },
  {
    id: '4',
    title: 'Financial Literacy',
    category: 'Life Skills',
    description: 'Budgeting, investing, and planning for the future.',
    learners: '3.1k',
    trending: true,
  },
  {
    id: '5',
    title: 'Negotiation Tactics',
    category: 'Career',
    description: 'Get better outcomes in deals and conversations.',
    learners: '980',
    trending: false,
  },
  {
    id: '6',
    title: 'Mindful Cooking',
    category: 'Lifestyle',
    description: 'Simple, intentional meals from scratch.',
    learners: '1.1k',
    trending: false,
  },
];

const CARD_HEIGHT = 96;

const CATEGORY_COLORS = {
  Creative: '#8B5CF6',
  'Personal Growth': '#10B981',
  Communication: '#3B82F6',
  'Life Skills': '#F59E0B',
  Career: '#EF4444',
  Lifestyle: '#EC4899',
};

const TrendCard = React.memo(function TrendCard({ item, onPress }) {
  const accentColor = CATEGORY_COLORS[item.category] || '#6B7280';

  return (
    <TouchableOpacity
      style={[styles.card, { height: CARD_HEIGHT }]}
      activeOpacity={0.7}
      onPress={() => onPress(item.id)}
    >
      <View style={[styles.accentBar, { backgroundColor: accentColor }]} />

      <View style={styles.cardBody}>
        <View style={styles.cardHeaderRow}>
          <Text style={[styles.category, { color: accentColor }]}>
            {item.category.toUpperCase()}
          </Text>
          {item.trending && (
            <View style={styles.trendingBadge}>
              <Text style={styles.trendingText}>🔥 Trending</Text>
            </View>
          )}
        </View>

        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>

        <Text style={styles.description} numberOfLines={1}>
          {item.description}
        </Text>

        <Text style={styles.learners}>{item.learners} learners</Text>
      </View>
    </TouchableOpacity>
  );
});

export default function DiscoverScreen({ navigation }) {
  const [trends, setTrends] = useState(INITIAL_TRENDS);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      // TODO: replace with real fetch, e.g.:
      // const data = await fetchTrends();
      // setTrends(data);
    } catch (err) {
      console.error('Failed to refresh trends', err);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const handlePress = useCallback(
    (id) => navigation?.navigate('SkillDetail', { id }),
    [navigation]
  );

  const renderItem = useCallback(
    ({ item }) => <TrendCard item={item} onPress={handlePress} />,
    [handlePress]
  );

  const keyExtractor = useCallback((item) => item.id, []);

  const getItemLayout = useCallback(
    (_, index) => ({
      length: CARD_HEIGHT + 12,
      offset: (CARD_HEIGHT + 12) * index,
      index,
    }),
    []
  );

  const emptyContainerStyle = useMemo(
    () => (trends.length === 0 ? { flexGrow: 1, justifyContent: 'center' } : undefined),
    [trends.length]
  );

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Discover New Skills</Text>
      <Text style={styles.subtitle}>What people are learning this week</Text>

      <FlatList
        data={trends}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        getItemLayout={getItemLayout}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={globalStyles.cardText}>No trends yet — check back soon.</Text>
        }
        contentContainerStyle={[styles.listContent, emptyContainerStyle]}
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={7}
        removeClippedSubviews
      />
    </View>
  );
}

const styles = {
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: -8,
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 24,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  accentBar: {
    width: 5,
  },
  cardBody: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    justifyContent: 'center',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  category: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  trendingBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  trendingText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#92400E',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  description: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },
  learners: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '500',
  },
};