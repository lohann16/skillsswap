import React, { useState, useEffect, useRef } from 'react';
import {View,Text,FlatList,TextInput,TouchableOpacity,StyleSheet,KeyboardAvoidingView,Platform,} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { ref, push, onValue, serverTimestamp } from 'firebase/database';
import { auth, db } from '../firebase/config';

const formatTime = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const ChatScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const contact = route.params?.contact;
  // "conversationId" — despite the field being named `id` on the contact
  // object, this is a thread id, not necessarily an accepted-match id.
  const conversationId = contact?.id;
  const currentUid = auth.currentUser?.uid;

  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const flatListRef = useRef(null);

  useEffect(() => {
    if (!conversationId) return;

    const messagesRef = ref(db, `messages/${conversationId}`);

    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val() || {};

      // Realtime Database's push() keys sort chronologically, so a plain
      // key sort is enough to get correct message order.
      const sorted = Object.entries(data)
        .sort(([keyA], [keyB]) => (keyA > keyB ? 1 : -1))
        .map(([id, msg]) => ({
          id,
          senderId: msg.senderId,
          text: msg.text,
          timestamp: msg.timestamp,
        }));

      setMessages(sorted);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 50);
    });

    return unsubscribe;
  }, [conversationId]);

  const handleSendMessage = () => {
    if (!messageText.trim() || !conversationId || !currentUid) return;

    push(ref(db, `messages/${conversationId}`), {
      senderId: currentUid,
      text: messageText.trim(),
      timestamp: serverTimestamp(),
    });

    setMessageText('');
  };

  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Contacts');
    }
  };

  const initials = (contact?.name || '?')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('') || '?';

  const renderMessage = ({ item }) => {
    const isMine = item.senderId === currentUid;
    return (
      <View style={[styles.messageRow, isMine ? styles.rowRight : styles.rowLeft]}>
        <View style={[styles.messageBubble, isMine ? styles.messageRight : styles.messageLeft]}>
          <Text style={[styles.messageText, isMine && styles.messageTextMine]}>{item.text}</Text>
        </View>
        <Text style={[styles.timestamp, isMine ? styles.timestampRight : styles.timestampLeft]}>
          {formatTime(item.timestamp)}
        </Text>
      </View>
    );
  };

  const header = (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={handleGoBack}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="chevron-back" size={24} color="#172554" />
      </TouchableOpacity>

      {contact?.name ? (
        <>
          <View style={styles.headerAvatar}>
            <Text style={styles.headerAvatarText}>{initials}</Text>
          </View>
          <Text style={styles.chatHeaderName} numberOfLines={1}>
            {contact.name}
          </Text>
        </>
      ) : (
        <Text style={styles.chatHeaderName}>Chat</Text>
      )}

      <View style={styles.headerSpacer} />
    </View>
  );

  if (!conversationId) {
    return (
      <View style={styles.chatContainer}>
        {header}
        <View style={styles.emptyContainer}>
          <Ionicons name="alert-circle-outline" size={40} color="#c7d2fe" />
          <Text style={styles.emptyText}>
            No conversation selected. Go back and pick someone from Contacts to chat with.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.chatContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {header}

      {messages.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="chatbubble-ellipses-outline" size={40} color="#c7d2fe" />
          <Text style={styles.emptyText}>
            No messages yet — say hi to {contact?.name?.split(' ')[0] || 'them'} 👋
          </Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          style={styles.messageList}
          contentContainerStyle={styles.messageListContent}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={messageText}
          onChangeText={setMessageText}
          placeholder="Type your message..."
          placeholderTextColor="#94A3B8"
          multiline
        />
        <TouchableOpacity
          style={[styles.sendButton, !messageText.trim() && styles.sendButtonDisabled]}
          onPress={handleSendMessage}
          disabled={!messageText.trim()}
          activeOpacity={0.85}
        >
          <Ionicons name="send" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({

  // =====================================================
  // SCREEN
  // =====================================================

  chatContainer: {
    flex: 1,
    backgroundColor: '#F5F7FF',
  },

  // =====================================================
  // HEADER
  // =====================================================

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: Platform.OS === 'ios' ? 8 : 20,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E4E7F2',
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF2FF',
    marginRight: 10,
  },

  headerAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  headerAvatarText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },

  chatHeaderName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#172554',
    flex: 1,
  },

  headerSpacer: {
    width: 40,
  },

  // =====================================================
  // MESSAGE LIST
  // =====================================================

  messageList: {
    flex: 1,
  },

  messageListContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 6,
  },

  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyText: {
    marginTop: 10,
    color: '#94A3B8',
    textAlign: 'center',
    paddingHorizontal: 30,
  },

  messageRow: {
    marginVertical: 4,
    maxWidth: '78%',
  },

  rowLeft: {
    alignSelf: 'flex-start',
  },

  rowRight: {
    alignSelf: 'flex-end',
  },

  messageBubble: {
    padding: 10,
    borderRadius: 14,
  },

  messageLeft: {
    backgroundColor: '#EEF2FF',
    borderBottomLeftRadius: 4,
  },

  messageRight: {
    backgroundColor: '#4F46E5',
    borderBottomRightRadius: 4,
  },

  messageText: {
    fontSize: 16,
    color: '#172554',
  },

  messageTextMine: {
    color: '#FFFFFF',
  },

  timestamp: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },

  timestampLeft: {
    textAlign: 'left',
    marginLeft: 4,
  },

  timestampRight: {
    textAlign: 'right',
    marginRight: 4,
  },

  // =====================================================
  // INPUT BAR
  // =====================================================

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderColor: '#E4E7F2',
  },

  textInput: {
    flex: 1,
    maxHeight: 100,
    backgroundColor: '#F5F7FF',
    borderColor: '#DDE3F0',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginRight: 8,
    fontSize: 15,
    color: '#172554',
  },

  sendButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 20,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },

  sendButtonDisabled: {
    backgroundColor: '#C7D2FE',
    shadowOpacity: 0,
    elevation: 0,
  },
});

export default ChatScreen;