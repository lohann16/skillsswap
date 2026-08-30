import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ref, onValue, get } from 'firebase/database';
import { auth, db } from '../firebase/config';
import { globalStyles } from '../styles/globalStyles';
import { findAndCreateMatches } from '../utils/matchmaking';
import { getConversationId } from './ContactsScreen';

export default function MatchesScreen() {
  const navigation = useNavigation();
  const [searchTerm, setSearchTerm] = useState('');
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [finding, setFinding] = useState(false);

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
            counterpartId,
            category: match.skillCategory || 'General',
            status: match.status || 'pending',
            score: match.score,
          };
        })
      );

      // Best matches first
      resolved.sort((a, b) => (b.score || 0) - (a.score || 0));

      setMatches(resolved);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleFindMatches = async () => {
    const currentUid = auth.currentUser?.uid;
    if (!currentUid) return;

    setFinding(true);
    try {
      const result = await findAndCreateMatches(currentUid);
      if (result.reason === 'no_skills') {
        Alert.alert(
          'Add your skills first',
          'Set what you can teach and what you want to learn so we can find people who complement you.'
        );
      } else if (result.created === 0) {
        Alert.alert('No new matches', 'No one new overlaps with your skills right now — check back later.');
      } else {
        Alert.alert('Matches found!', `Found ${result.created} new match${result.created === 1 ? '' : 'es'}.`);
      }
    } catch (err) {
      Alert.alert('Something went wrong', 'Could not search for matches right now. Please try again.');
    } finally {
      setFinding(false);
    }
  };

  const handleMessage = (item) => {
    const currentUid = auth.currentUser?.uid;
    navigation.navigate('ChatRoom', {
      contact: {
        id: getConversationId(currentUid, item.counterpartId),
        name: item.name,
        counterpartId: item.counterpartId,
      },
    });
  };

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
      <TouchableOpacity style={globalStyles.cardButton} onPress={() => handleMessage(item)}>
        <Text style={globalStyles.cardButtonText}>Message</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Matched Users</Text>

      <TouchableOpacity
        style={[globalStyles.primaryButton, finding && { opacity: 0.6 }]}
        onPress={handleFindMatches}
        disabled={finding}
      >
        {finding ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={globalStyles.primaryButtonText}>Find New Matches</Text>
        )}
      </TouchableOpacity>

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
          No matches yet. Tap "Find New Matches" above to search for people whose skills complement yours.
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