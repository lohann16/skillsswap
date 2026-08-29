import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Image, ActivityIndicator } from 'react-native';
import { ref, onValue, get } from 'firebase/database';
import { auth, db } from '../firebase/config';
import { globalStyles } from '../styles/globalStyles';

export default function MatchesScreen() {
  const [searchTerm, setSearchTerm] = useState('');
  const [matches, setMatches] = useState([]);
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

      // Matches involving the current user, on either side of the pairing
      const myMatchEntries = Object.entries(data).filter(
        ([, match]) => match.userA_id === currentUid || match.userB_id === currentUid
      );

      // Resolve each match's counterpart user profile (name) for display.
      // A one-off get() per match is fine at this scale — swap for a
      // denormalized "matches by user" index if the match list grows large.
      const resolved = await Promise.all(
        myMatchEntries.map(async ([matchId, match]) => {
          const counterpartId = match.userA_id === currentUid ? match.userB_id : match.userA_id;
          let counterpartName = 'Unknown user';
          try {
            const userSnap = await get(ref(db, `users/${counterpartId}`));
            if (userSnap.exists()) {
              counterpartName = userSnap.val().name || counterpartName;
            }
          } catch (e) {
            // Keep the fallback name if the lookup fails
          }

          return {
            id: matchId,
            name: counterpartName,
            category: match.skillCategory || 'General',
            status: match.status || 'pending',
          };
        })
      );

      setMatches(resolved);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const filteredMatches = matches.filter((match) =>
    match.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <View style={globalStyles.card}>
      <View style={globalStyles.cardHeader}>
        <View style={globalStyles.cardInfo}>
          <Text style={globalStyles.cardText}>{item.name}</Text>
          <Text style={globalStyles.cardSubText}>Category: {item.category}</Text>
        </View>
        <View style={globalStyles.statusIndicator}>
          <Text style={[globalStyles.statusText, item.status === 'active' ? globalStyles.online : globalStyles.offline]}>
            {item.status}
          </Text>
        </View>
      </View>
      <TouchableOpacity style={globalStyles.cardButton}>
        <Text style={globalStyles.cardButtonText}>View Profile</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Matched Users</Text>
      <TextInput
        style={globalStyles.searchInput}
        placeholder="Search matches..."
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      {loading ? (
        <ActivityIndicator style={{ marginTop: 30 }} color="#4a90e2" />
      ) : filteredMatches.length === 0 ? (
        <Text style={globalStyles.emptyText}>
          No matches yet. Once you're paired with someone, they'll show up here.
        </Text>
      ) : (
        <FlatList
          data={filteredMatches}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={globalStyles.listContainer}
        />
      )}
    </View>
  );
}