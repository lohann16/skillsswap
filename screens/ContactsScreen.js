import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { ref, onValue, get } from 'firebase/database';
import { auth, db } from '../firebase/config';
import { globalStyles } from '../styles/globalStyles';

export default function ContactsScreen({ navigation }) {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUid = auth.currentUser?.uid;
    if (!currentUid) {
      setLoading(false);
      return;
    }

    const matchesRef = ref(db, 'matches');

    const unsubscribe = onValue(matchesRef, async (snapshot) => {
      const data = snapshot.val() || {};

      // A "contact" is anyone the current user has an active match with
      const myMatchEntries = Object.entries(data).filter(
        ([, match]) =>
          (match.userA_id === currentUid || match.userB_id === currentUid) &&
          match.status === 'active'
      );

      const resolved = await Promise.all(
        myMatchEntries.map(async ([matchId, match]) => {
          const counterpartId = match.userA_id === currentUid ? match.userB_id : match.userA_id;
          let name = 'Unknown user';
          try {
            const userSnap = await get(ref(db, `users/${counterpartId}`));
            if (userSnap.exists()) {
              name = userSnap.val().name || name;
            }
          } catch (e) {
            // Keep the fallback name if the lookup fails
          }

          return { id: matchId, name, counterpartId };
        })
      );

      setContacts(resolved);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleContactPress = (contact) => {
    navigation.navigate('Chat', { contact });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleContactPress(item)}>
      <View style={globalStyles.contactCard}>
        <Text style={globalStyles.contactText}>{item.name}</Text>
        <TouchableOpacity style={globalStyles.contactButton} onPress={() => handleContactPress(item)}>
          <Text style={globalStyles.contactButtonText}>Chat</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 30 }} color="#4a90e2" />;
  }

  if (contacts.length === 0) {
    return (
      <Text style={[globalStyles.emptyText, { marginTop: 30 }]}>
        No contacts yet. Once you have an active match, they'll show up here to chat with.
      </Text>
    );
  }

  return (
    <FlatList
      data={contacts}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={{ paddingBottom: 20 }}
    />
  );
}