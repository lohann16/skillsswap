// screens/ProfileScreen.js

import React, { useState, useEffect } from 'react';
import {View,Text,TouchableOpacity,ScrollView,StyleSheet,ActivityIndicator,} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { ref, onValue } from 'firebase/database';
import { auth, db } from '../firebase/config';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const [user, setUser] = useState({
    name: '',
    skillsToTeach: [],
    skillsToLearn: [],
    availability: 'Not set yet',
    location: 'Not set yet',
    matchesCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUid = auth.currentUser?.uid;
    if (!currentUid) {
      setLoading(false);
      return;
    }

    // Individually track each piece so any one of them updating
    // (e.g. editing availability later) refreshes just that part.
    let profileData = {};
    let teachSkill = null;
    let learnSkill = null;
    let matchesCount = 0;

    const applyState = () => {
      setUser({
        name: profileData.name || auth.currentUser?.displayName || 'SkillSwap user',
        location: profileData.location || 'Not set yet',
        availability: profileData.availability || 'Not set yet',
        // Only one teach/learn skill is captured today — wrapped in an
        // array so the existing chip rendering below needs no changes.
        skillsToTeach: teachSkill ? [teachSkill] : [],
        skillsToLearn: learnSkill ? [learnSkill] : [],
        matchesCount,
      });
      setLoading(false);
    };

    const unsubUser = onValue(ref(db, `users/${currentUid}`), (snap) => {
      profileData = snap.val() || {};
      applyState();
    });

    const unsubTeach = onValue(ref(db, `user_skills_teach/${currentUid}`), (snap) => {
      teachSkill = snap.val()?.skill || null;
      applyState();
    });

    const unsubLearn = onValue(ref(db, `user_skills_learn/${currentUid}`), (snap) => {
      learnSkill = snap.val()?.skill || null;
      applyState();
    });

    const unsubMatches = onValue(ref(db, 'matches'), (snap) => {
      const data = snap.val() || {};
      matchesCount = Object.values(data).filter(
        (match) => match.userA_id === currentUid || match.userB_id === currentUid
      ).length;
      applyState();
    });

    return () => {
      unsubUser();
      unsubTeach();
      unsubLearn();
      unsubMatches();
    };
  }, []);

  const initials = user.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'S';

  if (loading) {
    return (
      <View style={[styles.screen, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator color="#4F46E5" size="large" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <View style={styles.header}>
        <Text style={styles.pageTitle}>Profile</Text>

        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons
            name="settings-outline"
            size={21}
            color="#4F46E5"
          />
        </TouchableOpacity>
      </View>

      {/* =====================================================
          PROFILE HERO
      ===================================================== */}

      <View style={styles.profileHero}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>

        <View style={styles.heroInfo}>
          <Text style={styles.name}>{user.name}</Text>

          <View style={styles.locationRow}>
            <Ionicons
              name="location-outline"
              size={15}
              color="#64748B"
            />

            <Text style={styles.location}>
              {user.location}
            </Text>
          </View>
        </View>

        <View style={styles.verifiedBadge}>
          <Ionicons
            name="checkmark-circle"
            size={18}
            color="#059669"
          />
        </View>
      </View>

      {/* =====================================================
          QUICK STATS
      ===================================================== */}

      <View style={styles.statsCard}>
        <View style={styles.stat}>
          <View style={[styles.statIcon, styles.blueIcon]}>
            <Ionicons
              name="school-outline"
              size={19}
              color="#2563EB"
            />
          </View>

          <Text style={styles.statNumber}>
            {user.skillsToTeach.length}
          </Text>

          <Text style={styles.statLabel}>Teaching</Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.stat}>
          <View style={[styles.statIcon, styles.purpleIcon]}>
            <Ionicons
              name="bulb-outline"
              size={19}
              color="#7C3AED"
            />
          </View>

          <Text style={styles.statNumber}>
            {user.skillsToLearn.length}
          </Text>

          <Text style={styles.statLabel}>Learning</Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.stat}>
          <View style={[styles.statIcon, styles.greenIcon]}>
            <Ionicons
              name="people-outline"
              size={19}
              color="#059669"
            />
          </View>

          <Text style={styles.statNumber}>{user.matchesCount}</Text>

          <Text style={styles.statLabel}>Matches</Text>
        </View>
      </View>

      {/* =====================================================
          ABOUT / DETAILS
      ===================================================== */}

      <Text style={styles.sectionTitle}>About you</Text>

      <View style={styles.card}>

        {/* Location */}
        <View style={styles.infoRow}>
          <View style={[styles.infoIcon, styles.blueIcon]}>
            <Ionicons
              name="location-outline"
              size={20}
              color="#2563EB"
            />
          </View>

          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Location</Text>
            <Text style={styles.infoValue}>
              {user.location}
            </Text>
          </View>
        </View>

        <View style={styles.rowDivider} />

        {/* Availability */}
        <View style={styles.infoRow}>
          <View style={[styles.infoIcon, styles.cyanIcon]}>
            <Ionicons
              name="time-outline"
              size={20}
              color="#0891B2"
            />
          </View>

          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Availability</Text>
            <Text style={styles.infoValue}>
              {user.availability}
            </Text>
          </View>
        </View>

      </View>

      {/* =====================================================
          SKILLS TO TEACH
      ===================================================== */}

      <Text style={styles.sectionTitle}>
        Skills you can teach
      </Text>

      <View style={styles.skillsCard}>
        {user.skillsToTeach.length === 0 ? (
          <Text style={styles.emptySkillsText}>
            You haven't added a skill to teach yet.
          </Text>
        ) : (
          user.skillsToTeach.map((skill, index) => (
            <View
              key={skill}
              style={[
                styles.skillChip,
                index % 2 === 0
                  ? styles.blueChip
                  : styles.cyanChip,
              ]}
            >
              <Ionicons
                name={
                  index % 2 === 0
                    ? 'code-slash-outline'
                    : 'restaurant-outline'
                }
                size={16}
                color={
                  index % 2 === 0
                    ? '#2563EB'
                    : '#0891B2'
                }
              />

              <Text
                style={[
                  styles.skillText,
                  {
                    color:
                      index % 2 === 0
                        ? '#2563EB'
                        : '#0891B2',
                  },
                ]}
              >
                {skill}
              </Text>
            </View>
          ))
        )}
      </View>

      {/* =====================================================
          SKILLS TO LEARN
      ===================================================== */}

      <Text style={styles.sectionTitle}>
        Skills you want to learn
      </Text>

      <View style={styles.skillsCard}>
        {user.skillsToLearn.length === 0 ? (
          <Text style={styles.emptySkillsText}>
            You haven't added a skill to learn yet.
          </Text>
        ) : (
          user.skillsToLearn.map((skill) => (
            <View
              key={skill}
              style={[
                styles.skillChip,
                styles.purpleChip,
              ]}
            >
              <Ionicons
                name="sparkles-outline"
                size={16}
                color="#7C3AED"
              />

              <Text
                style={[
                  styles.skillText,
                  styles.purpleText,
                ]}
              >
                {skill}
              </Text>
            </View>
          ))
        )}
      </View>

      {/* =====================================================
          ACTIONS
      ===================================================== */}

      <Text style={styles.sectionTitle}>Manage</Text>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => navigation.navigate('EditProfile', { profile: user })}
        activeOpacity={0.85}
      >
        <Ionicons
          name="create-outline"
          size={20}
          color="#FFFFFF"
        />

        <Text style={styles.primaryButtonText}>
          Edit Profile
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => navigation.navigate('Testimonials')}
        activeOpacity={0.8}
      >
        <View style={styles.buttonIcon}>
          <Ionicons
            name="star-outline"
            size={19}
            color="#F59E0B"
          />
        </View>

        <View style={styles.buttonContent}>
          <Text style={styles.secondaryButtonTitle}>
            Testimonials
          </Text>

          <Text style={styles.secondaryButtonSubtitle}>
            See what others say about you
          </Text>
        </View>

        <Ionicons
          name="chevron-forward"
          size={20}
          color="#94A3B8"
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => navigation.navigate('CommunityRules')}
        activeOpacity={0.8}
      >
        <View
          style={[
            styles.buttonIcon,
            styles.purpleIcon,
          ]}
        >
          <Ionicons
            name="shield-checkmark-outline"
            size={19}
            color="#7C3AED"
          />
        </View>

        <View style={styles.buttonContent}>
          <Text style={styles.secondaryButtonTitle}>
            Community Rules
          </Text>

          <Text style={styles.secondaryButtonSubtitle}>
            Keep the community safe and respectful
          </Text>
        </View>

        <Ionicons
          name="chevron-forward"
          size={20}
          color="#94A3B8"
        />
      </TouchableOpacity>

      <View style={styles.bottomSpace} />
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
    paddingBottom: 110,
  },

  // =====================================================
  // HEADER
  // =====================================================

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },

  pageTitle: {
    fontSize: 29,
    fontWeight: '800',
    color: '#172554',
    letterSpacing: -0.6,
  },

  settingsButton: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // =====================================================
  // PROFILE HERO
  // =====================================================

  profileHero: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E4E7F2',
    marginBottom: 16,

    shadowColor: '#312E81',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },

  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  avatarText: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: '800',
  },

  heroInfo: {
    flex: 1,
  },

  name: {
    fontSize: 20,
    fontWeight: '800',
    color: '#172554',
    marginBottom: 5,
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  location: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 4,
  },

  verifiedBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // =====================================================
  // STATS
  // =====================================================

  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 16,
    marginBottom: 26,
    borderWidth: 1,
    borderColor: '#E4E7F2',
  },

  stat: {
    flex: 1,
    alignItems: 'center',
  },

  statIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },

  statNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: '#172554',
  },

  statLabel: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
    fontWeight: '600',
  },

  statDivider: {
    width: 1,
    height: 45,
    backgroundColor: '#E2E8F0',
  },

  // =====================================================
  // SECTIONS
  // =====================================================

  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#172554',
    marginBottom: 12,
    marginTop: 4,
  },

  // =====================================================
  // INFORMATION CARD
  // =====================================================

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E4E7F2',
    marginBottom: 24,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },

  infoIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  infoContent: {
    flex: 1,
  },

  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
    marginBottom: 3,
  },

  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
  },

  rowDivider: {
    height: 1,
    backgroundColor: '#EEF2F7',
  },

  // =====================================================
  // SKILLS
  // =====================================================

  skillsCard: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E4E7F2',
    marginBottom: 24,
  },

  skillChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginRight: 8,
    marginBottom: 8,
  },

  skillText: {
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 6,
  },

  emptySkillsText: {
    fontSize: 13,
    color: '#94A3B8',
    padding: 6,
  },

  blueChip: {
    backgroundColor: '#EFF6FF',
  },

  cyanChip: {
    backgroundColor: '#ECFEFF',
  },

  purpleChip: {
    backgroundColor: '#F5F3FF',
  },

  purpleText: {
    color: '#7C3AED',
  },

  // =====================================================
  // COLORS
  // =====================================================

  blueIcon: {
    backgroundColor: '#EFF6FF',
  },

  purpleIcon: {
    backgroundColor: '#F5F3FF',
  },

  cyanIcon: {
    backgroundColor: '#ECFEFF',
  },

  greenIcon: {
    backgroundColor: '#ECFDF5',
  },

  // =====================================================
  // BUTTONS
  // =====================================================

  primaryButton: {
    height: 54,
    borderRadius: 14,
    backgroundColor: '#4F46E5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,

    shadowColor: '#4F46E5',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.18,
    shadowRadius: 9,
    elevation: 4,
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },

  secondaryButton: {
    width: '100%',
    minHeight: 70,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E4E7F2',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginBottom: 10,
  },

  buttonIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#FFF7ED',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  buttonContent: {
    flex: 1,
  },

  secondaryButtonTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#172554',
    marginBottom: 3,
  },

  secondaryButtonSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
  },

  bottomSpace: {
    height: 20,
  },
});