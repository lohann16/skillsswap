import React, { useState, useEffect, useRef } from 'react';
import {View,Text,FlatList,TextInput,TouchableOpacity,StyleSheet,KeyboardAvoidingView,Platform} from 'react-native';
import { useRoute } from '@react-navigation/native';
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

  if (!conversationId) {
    return (
      <View style={styles.chatContainer}>
        <Text style={styles.messageText}>
          No conversation selected. Go back and pick someone from Contacts to chat with.
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.chatContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {contact?.name ? <Text style={styles.chatHeader}>{contact.name}</Text> : null}

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
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={messageText}
          onChangeText={setMessageText}
          placeholder="Type your message..."
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Ionicons name="send" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  chatContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  chatHeader: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    color: '#172554',
  },
  messageList: {
    flex: 1,
    marginBottom: 10,
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  textInput: {
    flex: 1,
    maxHeight: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#4a90e2',
    borderRadius: 20,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ChatScreen;