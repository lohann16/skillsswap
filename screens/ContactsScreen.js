import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, TextInput, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ref, onValue } from 'firebase/database';
import { auth, db } from '../firebase/config';
import { globalStyles } from '../styles/globalStyles';

// A deterministic, order-independent thread id for any two users — this is
// what decouples chat from the match system, so any two real platform
// accounts can message each other without needing an accepted match first.
export const getConversationId = (uidA, uidB) => [uidA, uidB].sort().join('_');

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
      <TouchableOpacity onPress={() => handleContactPress(item)}>
        <View style={globalStyles.contactCard}>
          <View style={contactAvatarStyle}>
            <Text style={contactAvatarTextStyle}>{initials}</Text>
          </View>
          <Text style={[globalStyles.contactText, { flex: 1, marginLeft: 12 }]}>{item.name}</Text>
          <Ionicons name="chatbubble-outline" size={20} color="#4a90e2" />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <TextInput
        style={globalStyles.searchInput}
        placeholder="Search people on SkillSwap..."
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      {loading ? (
        <ActivityIndicator style={{ marginTop: 30 }} color="#4a90e2" />
      ) : filteredContacts.length === 0 ? (
        <Text style={[globalStyles.emptyText, { marginTop: 30 }]}>
          {contacts.length === 0
            ? "No one else has joined SkillSwap yet."
            : 'No one matches that search.'}
        </Text>
      ) : (
        <FlatList
          data={filteredContacts}
          keyExtractor={(item) => item.uid}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const contactAvatarStyle = {
  width: 42,
  height: 42,
  borderRadius: 21,
  backgroundColor: '#4a90e2',
  alignItems: 'center',
  justifyContent: 'center',
};

const contactAvatarTextStyle = {
  color: '#fff',
  fontWeight: '700',
  fontSize: 15,
};