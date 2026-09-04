import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { globalStyles } from '../styles/globalStyles';

const INITIAL_NOTIFICATIONS = [
  {
    id: '1',
    type: 'match',
    icon: '🔔',
    title: 'You have a new match!',
    subtitle: 'Say hello and start a conversation.',
    time: '2m ago',
    read: false,
  },
  {
    id: '2',
    type: 'session',
    icon: '📅',
    title: 'Reminder: Session at 4:30 PM',
    subtitle: 'Photography 101 with your mentor.',
    time: '15m ago',
    read: false,
  },
  {
    id: '3',
    type: 'message',
    icon: '💬',
    title: 'New message from Alex',
    subtitle: '"Looking forward to our session!"',
    time: '1h ago',
    read: true,
  },
  {
    id: '4',
    type: 'achievement',
    icon: '🏆',
    title: "You've completed 5 sessions!",
    subtitle: 'Keep up the momentum.',
    time: 'Yesterday',
    read: true,
  },
  {
    id: '5',
    type: 'system',
    icon: '⚙️',
    title: 'Profile updated successfully',
    subtitle: 'Your changes are now live.',
    time: '2 days ago',
    read: true,
  },
];

const ROW_HEIGHT = 76;

const NotificationRow = React.memo(function NotificationRow({ item, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.row, !item.read && styles.rowUnread]}
      activeOpacity={0.6}
      onPress={() => onPress(item.id)}
    >
      <View style={styles.iconWrap}>
        <Text style={styles.icon}>{item.icon}</Text>
        {!item.read && <View style={styles.dot} />}
      </View>

      <View style={styles.textWrap}>
        <Text
          style={[styles.title, !item.read && styles.titleUnread]}
          numberOfLines={1}
        >
          {item.title}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {item.subtitle}
        </Text>
      </View>

      <Text style={styles.time}>{item.time}</Text>
    </TouchableOpacity>
  );
});

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const handlePress = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const renderItem = useCallback(
    ({ item }) => <NotificationRow item={item} onPress={handlePress} />,
    [handlePress]
  );

  const keyExtractor = useCallback((item) => item.id, []);

  const getItemLayout = useCallback(
    (_, index) => ({ length: ROW_HEIGHT, offset: ROW_HEIGHT * index, index }),
    []
  );

  return (
    <View style={globalStyles.container}>
      <View style={styles.header}>
        <Text style={globalStyles.title}>Notifications</Text>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllRead}>
            <Text style={styles.markAllText}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={notifications}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        getItemLayout={getItemLayout}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <Text style={globalStyles.text}>You're all caught up 🎉</Text>
        }
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={7}
        removeClippedSubviews
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = {
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  markAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3B82F6',
  },
  listContent: {
    paddingBottom: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: ROW_HEIGHT,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  rowUnread: {
    backgroundColor: '#F0F7FF',
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 18,
  },
  dot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  textWrap: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  titleUnread: {
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 1,
  },
  time: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  separator: {
    height: 8,
  },
};