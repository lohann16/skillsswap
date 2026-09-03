import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ref, onValue } from 'firebase/database';
import { auth, db } from '../firebase/config';

// A deterministic, order-independent thread id for any two users — this is
// what decouples chat from the match system, so any two real platform
// accounts can message each other without needing an accepted match first.
export const getConversationId = (uidA, uidB) => [uidA, uidB].sort().join('_');

// A small fixed palette so avatars aren't all identical — picked
// deterministically per user so the same person always gets the same color.
const AVATAR_COLORS = ['#4F46E5', '#0891B2', '#7C3AED', '#059669', '#DB2777'];

const colorForName = (name) => {
  const sum = name
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return AVATAR_COLORS[sum % AVATAR_COLORS.length];
};

export default function ContactsScreen({ navigation }) {
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUid = auth.currentUser?.uid;
    if (!currentUid) {
      setLoading(false);
      return;
    }

    const unsubscribe = onValue(ref(db, 'users'), (snapshot) => {
      const data = snapshot.val() || {};

      // Every entry here comes straight from the real users table, so
      // there's no way to end up chatting with anyone who isn't an
      // actual registered account on the platform.
      const others = Object.entries(data)
        .filter(([uid]) => uid !== currentUid)
        .map(([uid, user]) => ({
          uid,
          name: user.name || 'SkillSwap user',
        }));

      setContacts(others);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleContactPress = (contact) => {
    const currentUid = auth.currentUser?.uid;
    navigation.navigate('ChatRoom', {
      contact: {
        id: getConversationId(currentUid, contact.uid),
        name: contact.name,
        counterpartId: contact.uid,
      },
    });
  };

  const renderItem = ({ item }) => {
    const initials = item.name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join('') || '?';

    return (
      <TouchableOpacity
        style={styles.contactCard}
        onPress={() => handleContactPress(item)}
        activeOpacity={0.7}
      >
        <View style={[styles.avatar, { backgroundColor: colorForName(item.name) }]}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>

        <Text style={styles.contactName} numberOfLines={1}>
          {item.name}
        </Text>

        <View style={styles.chatIconWrap}>
          <Ionicons name="chatbubble-outline" size={18} color="#4F46E5" />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.screen}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Contacts</Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={18} color="#94A3B8" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search people on SkillSwap..."
          placeholderTextColor="#94A3B8"
          value={searchTerm}
          onChangeText={setSearchTerm}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {searchTerm.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearchTerm('')}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close-circle" size={18} color="#CBD5E1" />
          </TouchableOpacity>
        )}
      </View>

      {/* List / states */}
      {loading ? (
        <ActivityIndicator style={styles.stateSpacing} color="#4F46E5" />
      ) : filteredContacts.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIconCircle}>
            <Ionicons
              name={contacts.length === 0 ? 'people-outline' : 'search-outline'}
              size={26}
              color="#94A3B8"
            />
          </View>
          <Text style={styles.emptyText}>
            {contacts.length === 0
              ? "No one else has joined SkillSwap yet."
              : 'No one matches that search.'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredContacts}
          keyExtractor={(item) => item.uid}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({

  // =====================================================
  // SCREEN
  // =====================================================

  screen: {
    flex: 1,
    backgroundColor: '#F5F7FF',
  },

  // =====================================================
  // HEADER
  // =====================================================

  header: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
  },

  pageTitle: {
    fontSize: 29,
    fontWeight: '800',
    color: '#172554',
    letterSpacing: -0.6,
  },

  // =====================================================
  // SEARCH
  // =====================================================

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDE3F0',
    borderRadius: 14,
    marginHorizontal: 20,
    marginBottom: 16,
    paddingHorizontal: 14,

    shadowColor: '#312E81',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 1,
  },

  searchIcon: {
    marginRight: 8,
  },

  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#172554',
    height: '100%',
  },

  // =====================================================
  // LIST
  // =====================================================

  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },

  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E4E7F2',

    shadowColor: '#312E81',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  avatarText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },

  contactName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: '#172554',
  },

  chatIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // =====================================================
  // STATES
  // =====================================================

  stateSpacing: {
    marginTop: 40,
  },

  emptyState: {
    alignItems: 'center',
    marginTop: 50,
    paddingHorizontal: 40,
  },

  emptyIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },

  emptyText: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 20,
  },
});