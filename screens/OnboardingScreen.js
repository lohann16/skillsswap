
// screens/OnboardingScreen.js

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

export default function OnboardingScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>

        {/* =====================================================
            LOGO
        ===================================================== */}

        <View style={styles.logoContainer}>
         
          <View style={styles.logoPlaceholder}>
            <Image
            source={require('../assets/logo1.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          </View>

          
        </View>

        {/* =====================================================
            HERO
        ===================================================== */}

        <View style={styles.heroContent}>
          <View style={styles.badge}>
            <View style={styles.badgeDot} />
            <Text style={styles.badgeText}>
              Learn. Teach. Grow.
            </Text>
          </View>

          <Text style={styles.title}>
            Welcome to{' '}
            <Text style={styles.titleAccent}>SkillSwap</Text>
          </Text>

          <Text style={styles.subtitle}>
            Share what you know, discover new skills, and connect
            with people who can help you grow.
          </Text>
        </View>

        {/* =====================================================
            FEATURE CARDS
        ===================================================== */}

        <View style={styles.features}>

          <View style={styles.feature}>
            <View style={[styles.featureIcon, styles.blueIcon]}>
              <Text style={styles.featureEmoji}>🎓</Text>
            </View>

            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>
                Teach your skills
              </Text>

              <Text style={styles.featureText}>
                Share what you're good at with others.
              </Text>
            </View>
          </View>

          <View style={styles.feature}>
            <View style={[styles.featureIcon, styles.purpleIcon]}>
              <Text style={styles.featureEmoji}>💡</Text>
            </View>

            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>
                Learn something new
              </Text>

              <Text style={styles.featureText}>
                Discover skills from people around you.
              </Text>
            </View>
          </View>

        </View>

        {/* =====================================================
            CTA
        ===================================================== */}

        <View style={styles.actions}>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('Login')}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryButtonText}>
              Get Started
            </Text>

            <Text style={styles.arrow}>
              →
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('CommunityRules')}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryButtonText}>
              Learn More
            </Text>
          </TouchableOpacity>

        </View>

        {/* =====================================================
            FOOTER
        ===================================================== */}

        <Text style={styles.footer}>
          Connect • Share • Grow
        </Text>

      </View>
    </SafeAreaView>
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
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  // =====================================================
  // LOGO
  // =====================================================

  logoContainer: {
  width: '100%',
  minHeight: 170,       // grows if content needs more room, never overlaps siblings
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: 10,
  marginBottom: 20,     // breathing room before the title/subtitle below
  overflow: 'hidden',   // safety net: nothing spills past the box
},

logo: {
  width: '80%',         // scales with screen width instead of a fixed px value
  maxWidth: 220,         // caps it on large/web screens so it doesn't get huge
  aspectRatio: 1,         // matches your logo file's square proportions — swap if yours isn't square
  height: undefined,      // let aspectRatio drive height instead of a fixed number
},

logoPlaceholder: {
  width: 100,
  height: 100,
  borderRadius: 30,
  backgroundColor: '#fafafa',
  alignItems: 'center',
  justifyContent: 'center',
  shadowColor: '#4F46E5',
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.2,
  shadowRadius: 14,
  elevation: 5,
},

logoPlaceholderText: {
  color: '#FFFFFF',
  fontSize: 48,
  fontWeight: '800',
},
  // =====================================================
  // HERO
  // =====================================================

  heroContent: {
    width: '100%',
    alignItems: 'center',
    marginTop: 5,
  },

  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 20,
    marginBottom: 16,
  },

  badgeDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#4F46E5',
    marginRight: 7,
  },

  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4F46E5',
  },

  title: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '800',
    color: '#172554',
    textAlign: 'center',
    letterSpacing: -0.8,
  },

  titleAccent: {
    color: '#4F46E5',
  },

  subtitle: {
    fontSize: 15,
    lineHeight: 23,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 12,
    maxWidth: 330,
  },

  // =====================================================
  // FEATURES
  // =====================================================

  features: {
    width: '100%',
    marginTop: 20,
  },

  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 17,
    padding: 13,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E4E7F2',
  },

  featureIcon: {
    width: 45,
    height: 45,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  blueIcon: {
    backgroundColor: '#EFF6FF',
  },

  purpleIcon: {
    backgroundColor: '#F5F3FF',
  },

  featureEmoji: {
    fontSize: 21,
  },

  featureContent: {
    flex: 1,
  },

  featureTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#172554',
    marginBottom: 3,
  },

  featureText: {
    fontSize: 12,
    lineHeight: 17,
    color: '#94A3B8',
  },

  // =====================================================
  // ACTIONS
  // =====================================================

  actions: {
    width: '100%',
    marginTop: 10,
  },

  primaryButton: {
    width: '100%',
    height: 55,
    backgroundColor: '#4F46E5',
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: '#4F46E5',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  arrow: {
    color: '#FFFFFF',
    fontSize: 20,
    marginLeft: 10,
    marginTop: -1,
  },

  secondaryButton: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },

  secondaryButtonText: {
    color: '#4F46E5',
    fontSize: 14,
    fontWeight: '700',
  },

  // =====================================================
  // FOOTER
  // =====================================================

  footer: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
});

