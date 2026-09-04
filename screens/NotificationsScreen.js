import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { globalStyles } from '../styles/globalStyles';

const ROW_HEIGHT = 76;

const ICONS = {
  match: '🔔',
  session: '📅',
  message: '💬',
  achievement: '🏆',
  system: '⚙️',
};

function formatRelativeTime(timestamp) {
  if (!timestamp) return '';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const diffMs = Date.now() - date.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}

const NotificationRow = React.memo(function NotificationRow({ item, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.row, !item.read && styles.rowUnread]}
      activeOpacity={0.6}
      onPress={() => onPress(item.id)}
    >
      <View style={styles.iconWrap}>
        <Text style={styles.icon}>{ICONS[item.type] || '🔔'}</Text>
        {!item.read && <View style={styles.dot} />}
      </View>

      <View style={styles.textWrap}>
        <Text style={[styles.title, !item.read && styles.titleUnread]} numberOfLines={1}>
          {item.title}
        </Text>
        {!!item.subtitle && (
          <Text style={styles.subtitle} numberOfLines={1}>
            {item.subtitle}
          </Text>
        )}
      </View>

      <Text style={styles.time}>{formatRelativeTime(item.createdAt)}</Text>
    </TouchableOpacity>
  );
});

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = auth().currentUser?.uid;

  // Real-time listener
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const unsubscribe = firestore()
      .collection('notifications')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(50)
      .onSnapshot(
        (snapshot) => {
          const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setNotifications(items);
          setLoading(false);
        },
        (err) => {
          console.error('Notifications listener error:', err);
          setError(err);
          setLoading(false);
        }
      );

    return unsubscribe;
  }, [userId]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const handlePress = useCallback(async (id) => {
    try {
      await firestore().collection('notifications').doc(id).update({ read: true });
    } catch (err) {
      console.error('Failed to mark notification read:', err);
    }
  }, []);

  const markAllRead = useCallback(async () => {
    const unread = notifications.filter((n) => !n.read);
    if (unread.length === 0) return;

    try {
      const batch = firestore().batch();
      unread.forEach((n) => {
        batch.update(firestore().collection('notifications').doc(n.id), { read: true });
      });
      await batch.commit();
    } catch (err) {
      console.error('Failed to mark all read:', err);
    }
  }, [notifications]);

  const renderItem = useCallback(
    ({ item }) => <NotificationRow item={item} onPress={handlePress} />,
    [handlePress]
  );

  const keyExtractor = useCallback((item) => item.id, []);

  const getItemLayout = useCallback(
    (_, index) => ({ length: ROW_HEIGHT, offset: ROW_HEIGHT * index, index }),
    []
  );

  if (loading) {
    return (
      <View style={[globalStyles.container, styles.centered]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[globalStyles.container, styles.centered]}>
        <Text style={globalStyles.text}>Couldn't load notifications. Pull down to retry.</Text>
      </View>
    );
  }

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
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
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