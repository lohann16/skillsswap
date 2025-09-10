// styles/globalStyles.js
import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
  // ====== Base Layout ======
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    marginBottom: 30,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginTop: 40,
  },

  // ====== Inputs & Forms ======
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f4f8',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 15,
    width: '100%',
  },

  // ====== Buttons ======
  primaryButton: {
    backgroundColor: '#4a90e2',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
    width: '80%',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    padding: 10,
    borderColor: '#4a90e2',
    borderWidth: 1.5,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
  },
  secondaryButtonText: {
    color: '#4a90e2',
    fontSize: 15,
    fontWeight: '500',
  },
  buttonPrimary: {
    backgroundColor: '#4a90e2',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // ====== Navigation Links ======
  link: {
    color: '#4a90e2',
    marginTop: 15,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  backButtonText: {
    marginLeft: 8,
    color: '#4a90e2',
    fontSize: 16,
    fontWeight: '600',
  },

  // ====== Picker ======
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    width: '100%',
    marginBottom: 20,
    overflow: 'hidden',
  },
  picker: {
    width: '100%',
    height: 50,
  },

  // ====== Cards ======
  card: {
    backgroundColor: '#f2f2f2',
    padding: 16,
    borderRadius: 10,
    marginBottom: 15,
    width: '100%',
  },
  cardText: {
    fontSize: 16,
    marginBottom: 8,
  },
  cardSubText: {
    fontSize: 14,
    color: '#666',
  },
  cardButton: {
    backgroundColor: '#4a90e2',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  cardButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  // ====== Dashboard Styles ======
  dashboardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#4a90e2',
  },
  tipBox: {
    backgroundColor: '#f0f4ff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    width: '100%',
  },

  // ====== Onboarding Screen ======
  onboardingImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  onboardingTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4a90e2',
    marginBottom: 10,
    textAlign: 'center',
  },
  onboardingSubtitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginHorizontal: 30,
    marginBottom: 30,
  },

  // ====== Profile Screen ======
  profileTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  listContainer: {
    width: '100%',
  },
  profileCard: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 20,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  profileLabel: {
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  profileValue: {
    marginLeft: 4,
    fontSize: 16,
    color: '#555',
  },

  // ====== Chat Screen ======
  chatContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  messageList: {
    flex: 1,
    marginVertical: 10,
  },
  messageBubble: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: '75%',
  },
  messageLeft: {
    backgroundColor: '#e1f5fe',
    alignSelf: 'flex-start',
  },
  messageRight: {
    backgroundColor: '#dcedc8',
    alignSelf: 'flex-end',
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  textInput: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#4a90e2',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  // ====== Contacts Screen ======
contactCard: {
  backgroundColor: '#f2f2f2',
  padding: 16,
  borderRadius: 10,
  marginBottom: 15,
  width: '100%',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
},
contactText: {
  fontSize: 16,
  fontWeight: '600',
},
contactButton: {
  backgroundColor: '#4a90e2',
  paddingVertical: 8,
  paddingHorizontal: 12,
  borderRadius: 6,
  alignItems: 'center',
},
contactButtonText: {
  color: '#fff',
  fontWeight: 'bold',
},
// ====== Chat Screen ======
// Added message list styles for proper scrolling behavior
messageList: {
  flex: 1,
  marginVertical: 10,
  paddingBottom: 10,  // Make sure the last message isn't hidden
},
messageBubble: {
  padding: 12,
  borderRadius: 12,
  marginVertical: 6,
  maxWidth: '75%',
},
messageLeft: {
  backgroundColor: '#e1f5fe',
  alignSelf: 'flex-start',
},
messageRight: {
  backgroundColor: '#dcedc8',
  alignSelf: 'flex-end',
},
messageText: {
  fontSize: 16,
  color: '#333',
},
inputContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: 10,
  borderTopWidth: 1,
  borderColor: '#ccc',
  backgroundColor: '#f9f9f9',
},
textInput: {
  flex: 1,
  height: 40,
  borderColor: '#ccc',
  borderWidth: 1,
  borderRadius: 20,
  paddingHorizontal: 12,
  marginRight: 8,
},
sendButton: {
  backgroundColor: '#4a90e2',
  borderRadius: 20,
  paddingVertical: 10,
  paddingHorizontal: 16,
},
sendButtonText: {
  color: '#fff',
  fontWeight: 'bold',
},
});
