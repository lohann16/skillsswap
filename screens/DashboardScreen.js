import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, get } from 'firebase/database';
import { auth, db } from '../firebase/config';
import { getConversationId } from './ContactsScreen';

export default function DashboardScreen({ navigation }) {
  const [displayName, setDisplayName] = useState('there');
  const [todayMatch, setTodayMatch] = useState(null);
  const [loadingMatch, setLoadingMatch] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Fall back to the email's first part if no display name was set
      setDisplayName(user?.displayName || user?.email?.split('@')[0] || 'there');
    });

    return unsubscribe;
  }, []);

  const loadTodayMatch = useCallback(async () => {
    const currentUid = auth.currentUser?.uid;
    if (!currentUid) {
      setLoadingMatch(false);
      return;
    }

    setLoadingMatch(true);
    try {
      const matchesSnap = await get(ref(db, 'matches'));
      const matchesData = matchesSnap.val() || {};

      // Only matches the current user is actually part of, so this can
      // never surface someone unrelated — and only real accounts, since
      // every match references a real users/{uid} record.
      const myMatches = Object.values(matchesData).filter(
        (m) => m.userA_id === currentUid || m.userB_id === currentUid
      );

      if (myMatches.length === 0) {
        setTodayMatch(null);
        return;
      }

      // Most recent match first when timestamps are available; otherwise
      // just take the first one found.
      myMatches.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      const latest = myMatches[0];
      const counterpartUid =
        latest.userA_id === currentUid ? latest.userB_id : latest.userA_id;

      const [userSnap, teachSnap] = await Promise.all([
        get(ref(db, `users/${counterpartUid}`)),
        get(ref(db, `user_skills_teach/${counterpartUid}`)),
      ]);

      const userData = userSnap.val();
      // The counterpart's account may have been removed since the match
      // was created — don't show a dangling match with no real user behind it.
      if (!userData) {
        setTodayMatch(null);
        return;
      }

      setTodayMatch({
        uid: counterpartUid,
        name: userData.name || 'SkillSwap user',
        skill: teachSnap.val()?.skill || null,
        availability: userData.availability || null,
      });
    } catch (err) {
      setTodayMatch(null);
    } finally {
      setLoadingMatch(false);
    }
  }, []);

  useEffect(() => {
    loadTodayMatch();
  }, [loadTodayMatch]);

  const handleChatWithMatch = () => {
    if (!todayMatch) return;
    const currentUid = auth.currentUser?.uid;
    navigation.navigate('Chat', {
      contact: {
        id: getConversationId(currentUid, todayMatch.uid),
        name: todayMatch.name,
        counterpartId: todayMatch.uid,
      },
    });
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Welcome back, {displayName}!</Text>
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={() => navigation.navigate('Notifications')}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="notifications-outline" size={22} color="#4F46E5" />
        </TouchableOpacity>
      </View>

      {/* Today's Match */}
      <Text style={styles.sectionTitle}>Today's Match</Text>

      {loadingMatch ? (
        <View style={styles.card}>
          <ActivityIndicator color="#4F46E5" />
        </View>
      ) : todayMatch ? (
        <View style={styles.card}>
          <View style={styles.matchRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {todayMatch.name
                  .split(' ')
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((p) => p[0]?.toUpperCase())
                  .join('') || '?'}
              </Text>
            </View>

            <View style={styles.matchInfo}>
              <Text style={styles.cardText} numberOfLines={1}>
                {todayMatch.name}
                {todayMatch.skill ? ` – ${todayMatch.skill}` : ''}
              </Text>
              <Text style={styles.cardSubText} numberOfLines={1}>
                {todayMatch.availability
                  ? `Available: ${todayMatch.availability}`
                  : 'Availability not set yet'}
              </Text>
            </View>
          </View>

          <TouchableOpacity style={styles.cardButton} onPress={handleChatWithMatch} activeOpacity={0.85}>
            <Text style={styles.cardButtonText}>Chat Now</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.card}>
          <Text style={styles.cardSubText}>
            No matches yet — head to Discover to find someone to learn or teach with.
          </Text>
        </View>
      )}

      {/* Discover Skills */}
      <Text style={styles.sectionTitle}>Discover New Skills</Text>
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => navigation.navigate('Discover')}
        activeOpacity={0.85}
      >
        <Text style={styles.primaryButtonText}>Explore Skills</Text>
      </TouchableOpacity>

      {/* Community Tips */}
      <Text style={styles.sectionTitle}>Tip of the Day</Text>
      <View style={styles.tipBox}>
        <Text style={styles.tipText}>
          Give specific, encouraging feedback when teaching — it builds confidence!
        </Text>
      </View>

    </ScrollView>
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

  container: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },

  // =====================================================
  // HEADER
  // =====================================================

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  title: {
    flex: 1,
    fontSize: 22,
    fontWeight: '800',
    color: '#172554',
    letterSpacing: -0.4,
    marginRight: 12,
  },

  notificationButton: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // =====================================================
  // SECTIONS
  // =====================================================

  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#172554',
    marginBottom: 10,
    marginTop: 6,
  },

  // =====================================================
  // CARD
  // =====================================================

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E4E7F2',
    marginBottom: 18,

    shadowColor: '#312E81',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  matchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },

  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  avatarText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
  },

  matchInfo: {
    flex: 1,
  },

  cardText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#172554',
    marginBottom: 3,
  },

  cardSubText: {
    fontSize: 13,
    color: '#64748B',
  },

  cardButton: {
    height: 46,
    borderRadius: 12,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
  },

  cardButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  // =====================================================
  // PRIMARY BUTTON
  // =====================================================

  primaryButton: {
    height: 54,
    borderRadius: 14,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,

    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  // =====================================================
  // TIP BOX
  // =====================================================

  tipBox: {
    backgroundColor: '#FFF7ED',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FDE7C8',
    padding: 16,
  },

  tipText: {
    fontSize: 14,
    color: '#92400E',
    lineHeight: 20,
  },
});