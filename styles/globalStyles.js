
// styles/globalStyles.js

import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
  // =====================================================
  // BASE
  // =====================================================

  container: {
    flex: 1,
    backgroundColor: '#F5F7FF',
    paddingHorizontal: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#172554',
    marginBottom: 24,
    letterSpacing: -0.6,
  },

  text: {
    fontSize: 16,
    lineHeight: 24,
    color: '#475569',
    marginBottom: 8,
  },

  emptyText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 40,
  },

  // =====================================================
  // INPUTS
  // =====================================================

  input: {
    width: '100%',
    height: 54,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDE3F0',
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#172554',
    marginBottom: 14,
  },

  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 54,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDE3F0',
    borderRadius: 14,
    paddingHorizontal: 14,
    marginBottom: 14,
  },

  // =====================================================
  // BUTTONS
  // =====================================================

  primaryButton: {
    width: '100%',
    height: 54,
    backgroundColor: '#4F46E5',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,

    shadowColor: '#4F46E5',
    shadowOffset: {
      width: 0,
      height: 5,
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

  secondaryButton: {
    width: '100%',
    height: 54,
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  secondaryButtonText: {
    color: '#4338CA',
    fontSize: 16,
    fontWeight: '700',
  },

  buttonPrimary: {
    width: '100%',
    height: 54,
    backgroundColor: '#4F46E5',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  // =====================================================
  // LINKS / NAVIGATION
  // =====================================================

  link: {
    color: '#4F46E5',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 14,
  },

  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 16,
  },

  backButtonText: {
    marginLeft: 8,
    color: '#334155',
    fontSize: 15,
    fontWeight: '600',
  },

  // =====================================================
  // PICKER
  // =====================================================

  pickerContainer: {
    width: '100%',
    height: 54,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDE3F0',
    borderRadius: 14,
    marginBottom: 16,
    overflow: 'hidden',
    justifyContent: 'center',
  },

  picker: {
    width: '100%',
    height: 54,
    color: '#172554',
  },

  // =====================================================
  // CARDS
  // =====================================================

  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E4E7F2',
    marginBottom: 14,

    shadowColor: '#312E81',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },

  cardText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#172554',
    marginBottom: 6,
  },

  cardSubText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#64748B',
  },

  cardButton: {
    backgroundColor: '#EEF2FF',
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12,
  },

  cardButtonText: {
    color: '#4F46E5',
    fontSize: 14,
    fontWeight: '700',
  },

  // =====================================================
  // DASHBOARD
  // =====================================================

  dashboardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#172554',
    marginBottom: 12,
  },

  tipBox: {
    width: '100%',
    backgroundColor: '#ECFEFF',
    borderRadius: 16,
    padding: 16,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#A5F3FC',
  },

  // =====================================================
  // ONBOARDING
  // =====================================================

  onboardingImage: {
    width: 170,
    height: 170,
    marginBottom: 28,
    resizeMode: 'contain',
  },

  onboardingTitle: {
    fontSize: 29,
    fontWeight: '800',
    color: '#172554',
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: -0.5,
  },

  onboardingSubtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: '#64748B',
    textAlign: 'center',
    marginHorizontal: 24,
    marginBottom: 32,
  },

  // =====================================================
  // PROFILE
  // =====================================================

  profileTitle: {
    fontSize: 25,
    fontWeight: '800',
    color: '#172554',
    marginBottom: 20,
  },

  listContainer: {
    width: '100%',
  },

  profileCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 18,
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

  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 9,
  },

  profileLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#334155',
    marginLeft: 8,
  },

  profileValue: {
    fontSize: 15,
    color: '#64748B',
    marginLeft: 5,
  },

  // =====================================================
  // CHAT
  // =====================================================

  chatContainer: {
    flex: 1,
    backgroundColor: '#F5F7FF',
    paddingHorizontal: 16,
  },

  messageList: {
    flex: 1,
    marginVertical: 8,
    paddingBottom: 10,
  },

  messageBubble: {
    paddingVertical: 11,
    paddingHorizontal: 15,
    borderRadius: 17,
    marginVertical: 4,
    maxWidth: '78%',
  },

  messageLeft: {
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 5,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  messageRight: {
    backgroundColor: '#4F46E5',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 5,
  },

  messageText: {
    fontSize: 15,
    lineHeight: 21,
    color: '#172554',
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderTopWidth: 1,
    borderColor: '#E0E7FF',
    backgroundColor: '#F5F7FF',
  },

  textInput: {
    flex: 1,
    minHeight: 46,
    maxHeight: 100,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDE3F0',
    borderRadius: 23,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    fontSize: 15,
    color: '#172554',
  },

  sendButton: {
    width: 46,
    height: 46,
    backgroundColor: '#4F46E5',
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: '#4F46E5',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },

  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  // =====================================================
  // CONTACTS
  // =====================================================

  contactCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E4E7F2',
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    shadowColor: '#312E81',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  contactText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#172554',
  },

  contactButton: {
    backgroundColor: '#EEF2FF',
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignItems: 'center',
  },

  contactButtonText: {
    color: '#4F46E5',
    fontSize: 14,
    fontWeight: '700',
  },

  // =====================================================
  // STATUS COLORS
  // =====================================================

  successBox: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 14,
    padding: 15,
  },

  successText: {
    color: '#047857',
    fontSize: 14,
    fontWeight: '600',
  },

  warningBox: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 14,
    padding: 15,
  },

  warningText: {
    color: '#B45309',
    fontSize: 14,
    fontWeight: '600',
  },

  errorBox: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 14,
    padding: 15,
  },

  errorText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '600',
  },

  // =====================================================
  // COLOR ACCENT CARDS
  // =====================================================

  blueCard: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
  },

  purpleCard: {
    backgroundColor: '#F5F3FF',
    borderColor: '#DDD6FE',
  },

  cyanCard: {
    backgroundColor: '#ECFEFF',
    borderColor: '#A5F3FC',
  },

  greenCard: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },

  orangeCard: {
    backgroundColor: '#FFF7ED',
    borderColor: '#FED7AA',
  },

  pinkCard: {
    backgroundColor: '#FDF2F8',
    borderColor: '#FBCFE8',
  },

  // =====================================================
  // ACCENT TEXT
  // =====================================================

  blueText: {
    color: '#2563EB',
    fontWeight: '700',
  },

  purpleText: {
    color: '#7C3AED',
    fontWeight: '700',
  },

  cyanText: {
    color: '#0891B2',
    fontWeight: '700',
  },

  greenText: {
    color: '#059669',
    fontWeight: '700',
  },

  orangeText: {
    color: '#EA580C',
    fontWeight: '700',
  },

  pinkText: {
    color: '#DB2777',
    fontWeight: '700',
  },

  // =====================================================
  // BADGES
  // =====================================================

  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
  },

  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4F46E5',
  },

  successBadge: {
    backgroundColor: '#DCFCE7',
  },

  successBadgeText: {
    color: '#15803D',
  },

  warningBadge: {
    backgroundColor: '#FEF3C7',
  },

  warningBadgeText: {
    color: '#B45309',
  },

  errorBadge: {
    backgroundColor: '#FEE2E2',
  },

  errorBadgeText: {
    color: '#B91C1C',
  },

  cyanBadge: {
    backgroundColor: '#CFFAFE',
  },

  cyanBadgeText: {
    color: '#0E7490',
  },
});

